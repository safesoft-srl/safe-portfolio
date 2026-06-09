<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Portfolio;

class CourseService
{
    public function getAll()
    {
        return Course::with('portfolio')->get();
    }

    public function create(array $data, Portfolio $portfolio)
    {
        return $portfolio->courses()->create($data);
    }

    public function getById(string $id)
    {
        return Course::findOrFail($id);
    }

    public function update(Course $course, array $data)
    {
        $course->update($data);

        return $course;
    }

    public function delete(Course $course)
    {
        $course->delete();
    }

    public function getByPortfolioId(int $portfolioId)
    {
        return Course::where('portfolio_id', $portfolioId)
            ->latest()
            ->get();
    }
}
