<?php

namespace App\Services;

use App\Models\Project;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProjectService
{
    public function __construct(
        private ImageUploadService $imageUploadService
    ) {}

    public function create(array $data)
    {
        $data = $this->handleImage($data);
        $project = Project::create($data);

        if (! empty($data['skill_ids'])) {
            $project->skills()->sync($data['skill_ids']);
        }

        return $project->load('skills');
    }

    private function handleImage($data): array
    {
        if (isset($data['project_image']) && $data['project_image']) {
            $upload = $this->imageUploadService->upload($data['project_image']);

            $data['url_image'] = $upload['url'];
            $data['image_id'] = $upload['image_id'];
        }

        return $data;
    }

    public function update(int $id, array $data)
    {
        $project = Project::findOrFail($id);

        if ($data['project_image'] ?? false) {
            if ($project->image_id) {
                $this->deleteImage($project->id);
            }
            $data = $this->handleImage($data);
        }
        $project->update($data);

        if (! empty($data['skill_ids'])) {
            $project->skills()->sync($data['skill_ids']);
        }

        return $project->fresh()->load('skills');
    }

    public function delete(int $id)
    {
        $project = Project::findOrFail($id);
        if (! $project) {
            return false;
        }

        $imageId = $project->image_id;
        if ($imageId) {
            $this->deleteImage($imageId);
            $project->update([
                'url_image' => null,
                'image_id' => null,
            ]);
        }

        $project->delete();

        return true;
    }

    public function getByPortfolio(int $portfolioId)
    {
        return Project::with('skills')
            ->where('portfolio_id', $portfolioId)
            ->get();
    }

    public function getById(int $id)
    {
        return Project::with('skills')->findOrFail($id);
    }

    public function getAll()
    {
        return Project::with('skills')->get();
    }

    private function deleteImage(string $imageId): void
    {
        if ($imageId) {
            Cloudinary::destroy($imageId);
        }
    }
}
