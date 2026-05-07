<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkExperienceRequest;
use App\Http\Requests\UpdateWorkExperienceRequest;
use App\Models\WorkExperience;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class WorkExperienceController extends Controller
{
    /**
     * HU15: Mostrar la lista de experiencias laborales del usuario autenticado (panel privado).
     */
    public function index(int $portfolioId): JsonResponse
    {
         /** @var \App\Models\User $user */
         $user = Auth::user();
        $portfolio = $user->portfolios()->findOrFail($portfolioId);
        $experiences = $portfolio->workExperiences()->orderBy('start_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $experiences,
            'message' => 'Work experiences retrieved successfully.',
        ]);
    }

    public function showAll()
    {
        $experiences = WorkExperience::all();

        return response()->json([
            'success' => true,
            'data' => $experiences,
            'message' => 'All work experiences retrieved successfully.',
        ]);
    }

    /**
     * HU12: Registrar experiencia laboral.
     */
    public function store(int $portfolioId, StoreWorkExperienceRequest $request): JsonResponse
    {   
         /** @var \App\Models\User $user */
        $user = Auth::user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no autenticado',
                'data' => null,
            ], 401);
        }

        $portfolio = $user->portfolios()->find($portfolioId);

        if (! $portfolio) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario no tiene portfolio',
                'data' => null,
            ], 404);
        }
        $data = $request->validated();

        $experience = $portfolio->workExperiences()->create($data);

        return response()->json([
            'success' => true,
            'data' => $experience,
            'message' => 'Work experience created successfully.',
        ], 201);
    }

    /**
     * HU13: Editar experiencia laboral.
     */
    public function update(int $portfolioId, UpdateWorkExperienceRequest $request, int $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $portfolio = $user->portfolios()->findOrFail($portfolioId);
        $experience = $portfolio->workExperiences()->find($id);

        if (! $experience) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Work experience not found or unauthorized.',
            ], 404);
        }

        $experience->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $experience,
            'message' => 'Work experience updated successfully.',
        ]);
    }

    /**
     * HU14: Eliminar experiencia laboral.
     */
    public function destroy(int $portfolioId, int $id): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $portfolio = $user->portfolios()->findOrFail($portfolioId);
        $experience = $portfolio->workExperiences()->find($id);

        if (! $experience) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Work experience not found or unauthorized.',
            ], 404);
        }

        $experience->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Work experience deleted successfully.',
        ]);
    }
}
