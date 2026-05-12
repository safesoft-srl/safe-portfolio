<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProyectRequest;
use App\Http\Resources\ProjectResource;
use App\Services\ProjectService;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectService $projectService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $proyects = $this->projectService->getAll();

        return ApiResponse::success(
            $proyects,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $proyect = $this->projectService->create($request->validated());

        return ApiResponse::success(
            $proyect,
            ResponseMessages::CREATED_SUCCESSFULLY,
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $proyect = $this->projectService->getById($id);

        return ApiResponse::success(
            $proyect,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProyectRequest $request, string $id)
    {
        $proyect = $this->projectService->update($id, $request->all());

        return ApiResponse::success(
            $proyect,
            ResponseMessages::UPDATED_SUCCESSFULLY
        );

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $proyectDeleted = $this->projectService->delete($id);

        return ApiResponse::success(
            null,
            ResponseMessages::DELETED_SUCCESSFULLY
        );

    }

    public function getByPortfolio(int $portfolioId)
    {
        $projects = $this->projectService->getByPortfolio($portfolioId);

        return ApiResponse::success(
            ProjectResource::collection($projects),
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function deleteImageProject(int $id)
    {
        $project = $this->projectService->deleteImageProject($id);

        return ApiResponse::success(
            $project,
            ResponseMessages::DELETED_SUCCESSFULLY
        );
    }
}
