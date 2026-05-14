<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Http\Requests\AcademicStoreRequest;
use App\Http\Requests\AcademicUpdateRequest;
use App\Services\AcademicService;

class AcademicController extends Controller
{
    public function __construct(
        private AcademicService $academicService
    ){}
    
    public function index()
    {
        $academics = $this->academicService->showAll();

        return ApiResponse::success(
            $academics,
            'Formaciones académicas obtenidas correctamente'
        );
    }

    public function store(AcademicStoreRequest $request, int  $portfolioId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $portfolio = $user->portfolios()->find($portfolioId);
        
        if (! $portfolio) {
            return ApiResponse::error(
                'Portafolio no encontrado',
                404
            );
        }

        $academic = $this->academicService->create(
            $request->validated(),
            $portfolioId
        );

        return ApiResponse::success(
            $academic,
            'Formación académica creada correctamente'
        );
    }

    public function show(int $id)
    {
        $academic = $this->academicService->getById($id);

        if (!$academic) {
            return ApiResponse::error(
                'Formación académica no encontrada',
                404
            );
        }

        return ApiResponse::success(
            $academic,
            'Formación académica obtenida correctamente'
        );
    }

    public function update(AcademicUpdateRequest $request, int $id)
    {
        $academic = $this->academicService->getById($id);

        if(!$academic) {
            return ApiResponse::error(
                'Formación académica no encontrada',
                404
            );

        }

        $updatedAcademic = $this->academicService->update(
            $academic,
            $request->validated()
        );

        return ApiResponse::success(
            $updatedAcademic,
            'Formación académica actualizada correctamente'
        );
    }

    public function destroy(int $id)
    {
        $academic = $this->academicService->getById($id);

        if(!$academic) {
            return ApiResponse::error(
                'Formación académica no encontrada',
                404
            );
        }

        $this->academicService->delete($academic);

        return ApiResponse::success(
            null,
            'Formación académica eliminada correctamente'
        );
    }

    public function getByPortfolio(int $portfolioId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $portfolio = $user->portfolios()->find($portfolioId);
        
        if (!$portfolio) {
            return ApiResponse::error(
                'Portafolio no encontrado',
                404
            );
        }

        $academics = $this->academicService->getByPortfolio($portfolioId);

        return ApiResponse::success(
            $academics,
            'Formaciones académicas obtenidas correctamente'
        );
    }
}
