<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkExperienceRequest;
use App\Http\Requests\UpdateWorkExperienceRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class WorkExperienceController extends Controller
{
    /**
     * HU15: Mostrar la lista de experiencias laborales del usuario autenticado (panel privado).
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $experiences = $user->workExperiences()->orderBy('start_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $experiences,
            'message' => 'Work experiences retrieved successfully.',
        ]);
    }

    /**
     * HU12: Registrar experiencia laboral.
     */
    public function store(StoreWorkExperienceRequest $request): JsonResponse
    {
        $user = Auth::user();
        $data = $request->validated();

        $experience = $user->workExperiences()->create($data);

        return response()->json([
            'success' => true,
            'data' => $experience,
            'message' => 'Work experience created successfully.',
        ], 201);
    }

    /**
     * HU13: Editar experiencia laboral.
     */
    public function update(UpdateWorkExperienceRequest $request, int $id): JsonResponse
    {
        $user = Auth::user();
        $experience = $user->workExperiences()->find($id);

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
    public function destroy(int $id): JsonResponse
    {
        $user = Auth::user();
        $experience = $user->workExperiences()->find($id);

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
