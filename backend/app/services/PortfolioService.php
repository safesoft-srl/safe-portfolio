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
}
