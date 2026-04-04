<?php

namespace App\Services;

use App\Models\Portfolio;

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
        return Portfolio::findOrFail($id);
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
            $data['profile_image'] = $this->imageUploadService
                ->upload($data['profile_image']);
        }

        return $data;
    }

    public function delete(int $id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->delete();

        return true;
    }
}
