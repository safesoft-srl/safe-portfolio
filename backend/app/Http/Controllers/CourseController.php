<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Services\CourseService;

class CourseController extends Controller
{
    public function __construct(
        private CourseService $courseService
    ) {}

    public function index()
    {
        $courses = $this->courseService->getAll();

        return ApiResponse::success(
            $courses,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function store(StoreCourseRequest $request, int $portfolioId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $portfolio = $user->portfolios()->find($portfolioId);

        if (! $portfolio) {
            return ApiResponse::error(
                'No existe el portafolio.',
                404
            );
        }

        $course = $this->courseService->create($request->validated(), $portfolio);

        return ApiResponse::success(
            $course,
            ResponseMessages::CREATED_SUCCESSFULLY,
            201
        );
    }

    public function show(string $id)
    {
        $course = $this->courseService->getById($id);

        return ApiResponse::success(
            $course,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function update(UpdateCourseRequest $request, int $id)
    {
        $course = $this->courseService->getById($id);

        $course = $this->courseService->update($course, $request->validated());

        return ApiResponse::success(
            $course,
            ResponseMessages::UPDATED_SUCCESSFULLY
        );
    }

    public function destroy(int $id)
    {
        $course = $this->courseService->getById($id);
        $this->courseService->delete($course);

        return ApiResponse::success(
            null,
            ResponseMessages::DELETED_SUCCESSFULLY
        );
    }

    public function getByPortfolioId(int $portfolioId)
    {
        $courses = $this->courseService->getByPortfolioId($portfolioId);

        return ApiResponse::success(
            $courses,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }
}
