<?php

namespace App\Services;

use App\Models\Portfolio;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class PortfolioService
{
    public function __construct(
        private ImageUploadService $imageUploadService
    ) {}

    public function create(array $data)
    {
        $data = $this->handleProfileImage($data);

        return Portfolio::create($data);
    }

    public function getAll()
    {
        return Portfolio::all();
    }

    public function getById(int $id)
    {
        return Portfolio::with(['user.workExperiences' => function ($query) {
            $query->where('is_visible', true)->orderBy('start_date', 'desc');
        }])->findOrFail($id);
    }

    public function getByUserId(int $userId)
    {
        return Portfolio::where('user_id', $userId)->firstOrFail();
    }

    public function update(int $user_id, array $data)
    {
        $portfolio = Portfolio::where('user_id', $user_id)->firstOrFail();
        $data = $this->handleProfileImage($data);
        $portfolio->update($data);

        return $portfolio->fresh();
    }

    private function handleProfileImage(array $data): array
    {
        if (isset($data['profile_image']) && $data['profile_image']) {
            $upload = $this->imageUploadService
                ->upload($data['profile_image']);

            $data['profile_image'] = $upload['url'];
            $data['image_id'] = $upload['image_id'];
        }

        return $data;
    }

    public function delete(int $id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->delete();

        return true;
    }

    public function deletePhoto(int $id)
    {
        $portfolio = Portfolio::findOrFail($id);

        if (! $portfolio->image_id) {
            return $portfolio;
        }

        Cloudinary::destroy($portfolio->image_id);

        $portfolio->update([
            'profile_image' => null,
            'image_id' => null,
        ]);

        return $portfolio->fresh();
    }

    public function slugExists(string $slug): bool
    {
        return Portfolio::where('portfolio_slug', $slug)->exists();
    }

    public function getBySlug(string $slug)
    {
        return Portfolio::with(
            [
                'portfolioSkills',
                'workExperiences' => function ($query) {
                    $query->where('is_visible', true);
                },
                'projects.skill_projects',
            ]
        )
            ->where('portfolio_slug', $slug)->firstOrFail();
    }

    public function saveUrlPortfolio(string $url, int $id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->update(['url_portfolio' => $url]);

        return $portfolio->fresh();
    }
}
