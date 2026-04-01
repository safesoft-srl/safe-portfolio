<?php

namespace App\Services;

use App\Models\Portfolio;

class PortfolioService
{
    public function create(array $data)
    {
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

    public function update(int $id, array $data)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->update($data);

        return $portfolio;
    }

    public function delete(int $id)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->delete();

        return true;
    }
}
