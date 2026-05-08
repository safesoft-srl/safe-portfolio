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
     * HU18: Mostrar la lista de experiencias laborales del usuario autenticado (panel privado).
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
            'message' => 'Experiencia laboral obtenida correctamente.',
        ]);
    }

    public function showAll()
    {
        $experiences = WorkExperience::all();

        return response()->json([
            'success' => true,
            'data' => $experiences,
            'message' => 'Todas las experiencias laborales fueron obtenidas correctamente.',
        ]);
    }

    /**
     * HU15: Registrar experiencia laboral.
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
            'message' => 'Experiencia laboral creada correctamente..',
        ], 201);
    }

    /**
     * HU16: Editar experiencia laboral.
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
                'message' => 'La experiencia laboral no fue encontrada o no estás autorizado.',
            ], 404);
        }

        $experience->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $experience,
            'message' => 'Experiencia laboral actualizada correctamente.',
        ]);
    }

    /**
     * HU17: Eliminar experiencia laboral.
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
                'message' => 'La experiencia laboral no fue encontrada o no estás autorizado.',
            ], 404);
        }

        $experience->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Experiencia laboral eliminada correctamente.',
        ]);
    }

    /**
     * HU18: Mostrar experiencia laboral de un portafolio público por su slug.
     */
    public function publicBySlug(string $slug): JsonResponse
    {
        $portfolio = \App\Models\Portfolio::where('portfolio_slug', $slug)->first();

        if (! $portfolio) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Portafolio no encontrado.',
            ], 404);
        }

        $experiences = $portfolio->workExperiences()
            ->where('is_visible', true)
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $experiences,
            'message' => 'Experiencias laborales públicas obtenidas correctamente.',
        ]);
    }
}
