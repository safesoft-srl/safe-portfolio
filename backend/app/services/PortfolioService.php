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

    public function update(int $id, array $data)
    {
        $portfolio = Portfolio::findOrFail($id);
        $portfolio->update($data);

        return $portfolio;
    }
}
