<?php

namespace App\Services;

use App\Models\Academyc_Training;

class AcademicService
{
    public function showAll()
    {
        return Academyc_Training::with('portfolio')
            ->where('is_visible', true)
            ->where('is_current', false)
            ->orderBy('end_date', 'asc')
            ->get();
    }

    public function create(array $data, int $portfolioId)
    {
        $data['portfolio_id'] = $portfolioId;

        $academic = Academyc_Training::create($data);

        return $academic;
    }

    public function getById(int $id)
    {
        $academic = Academyc_Training::find($id);

        if (! $academic) {
            return null;
        }

        return $academic;
    }

    public function update(Academyc_Training $academic, array $data)
    {
        $academic->update($data);

        return $academic;
    }

    public function delete(Academyc_Training $academic)
    {
        $academic->delete();
    }

    public function getByPortfolio(int $portfolioId)
    {
        return Academyc_Training::where('portfolio_id', $portfolioId)
            ->latest()
            ->get();
    }
}
