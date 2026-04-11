<?php

namespace App\Services;

use App\Models\Project;
use App\Services\ImageUploadService;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProjectService
{
    public function __construct(
        private ImageUploadService $imageUploadService
    ) {}

    public function create(array $data)
    {
        $data = $this->handleImage($data);
        $proyect = Project::create($data);
        
        if(!empty($data['skill_ids'])) {
            $proyect->skill_projects()->sync($data['skill_ids']);
        }

        return $proyect->load('skill_projects');
    }

    private function handleImage($data): array
    {
        if (isset($data['url_image']) && $data['url_image']) {
            $upload = $this->imageUploadService->upload($data['url_image']);

            $data['url_image'] = $upload['url'];
            $data['image_id'] = $upload['image_id'];
        }

        return $data;
    }

    public function update(int $id, array $data)
    {
        $project = Project::findOrFail($id);
        $data = $this->handleImage($data);
        $project->update($data);

        if(isset($data['skill_ids'])) {
            $project->skill_projects()->sync($data['skill_ids']);
        }

        return $project->fresh()->load('skill_projects');
    }

    public function delete(int $id)
    {
        $project = Project::findOrFail($id);
        if(!$project) {
            return false;
        }
        
        $imageId = $project->image_id;
        if($imageId) {
            $this->deleteImage($imageId);
        }

        $project->delete();

        return true;
    }

    public function getByPortfolio(int $portfolioId)
    {
        return Project::with('skill_projects')
        ->where('portfolio_id', $portfolioId)
        ->get();
    }

    public function getById(int $id)
    {
        return Project::with('skill_projects')->findOrFail($id);
    }

    public function getAll()
    {
        return Project::with('skill_projects')->get();
    }

    private function deleteImage(int $proyectId):void
    {
        $project = Project::findOrFail($proyectId);
        $imageId = $project->image_id;

        if ($imageId) {
            Cloudinary::destroy($imageId);
        }

        $project->update([
            'url_image' => null,
            'image_id' => null,
        ]);
    }
}

    


