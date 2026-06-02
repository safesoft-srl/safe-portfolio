<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Models\Portfolio;
use App\Models\PortfolioSoftSkill;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class PortfolioSoftSkillController extends Controller
{
    private function getUserPortfolioByIndex(int $portfolioId)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        if (! $user) {
            abort(401, 'No autenticado.');
        }

        $portfolio = $user->portfolios()->find($portfolioId);

        if (! $portfolio) {
            abort(404, 'No se encontró el portafolio solicitado para este usuario.');
        }

        return $portfolio;
    }

    public function index(int $portfolioId)
    {
        try {

            $portfolio = $this->getUserPortfolioByIndex($portfolioId);

            $softSkills = PortfolioSoftSkill::with('softSkill')
                ->where('portfolio_id', $portfolio->id)
                ->orderBy('id', 'desc')
                ->get();

            return ApiResponse::success(
                $softSkills,
                'Habilidades blandas cargadas correctamente.'
            );

        } catch (Throwable $e) {

            Log::error('Error obteniendo portfolio soft skills', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'Error al cargar las habilidades blandas. Intenta nuevamente más tarde.',
                500,
                null
            );
        }
    }

    public function store(Request $request, int $portfolioId)
    {
        try {

            $portfolio = $this->getUserPortfolioByIndex($portfolioId);

            $validated = $request->validate([
                'soft_skill_id' => 'required|exists:soft_skills,id',
                'description' => 'nullable|string|max:255',
            ], [
                'soft_skill_id.required' => 'La habilidad blanda es obligatoria.',
                'soft_skill_id.exists' => 'La habilidad seleccionada no existe.',
                'description.max' => 'La descripción no puede superar los 255 caracteres.',
            ]);

            $exists = PortfolioSoftSkill::where('portfolio_id', $portfolio->id)
                ->where('soft_skill_id', $validated['soft_skill_id'])
                ->exists();

            if ($exists) {
                return ApiResponse::error(
                    'Ya tienes registrada esta habilidad blanda en tu portafolio.',
                    409,
                    null
                );
            }

            $softSkill = PortfolioSoftSkill::create([
                'portfolio_id' => $portfolio->id,
                'soft_skill_id' => $validated['soft_skill_id'],
                'description' => $validated['description'] ?? null,
            ]);

            $softSkill->load('softSkill');

            return ApiResponse::success(
                $softSkill,
                'Habilidad blanda creada correctamente.',
                201
            );

        } catch (Throwable $e) {

            Log::error('Error creando portfolio soft skill', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo crear la habilidad blanda. Intenta nuevamente más tarde.',
                500,
                null
            );
        }
    }

    public function update(Request $request, int $portfolioId, int $id)
    {
        try {

            $portfolio = $this->getUserPortfolioByIndex($portfolioId);

            $softSkill = PortfolioSoftSkill::with('softSkill')
                ->where('portfolio_id', $portfolio->id)
                ->where('id', $id)
                ->firstOrFail();

            $validated = $request->validate([
                'description' => 'nullable|string|max:255',
            ], [
                'description.max' => 'La descripción no puede superar los 255 caracteres.',
            ]);

            $softSkill->update([
                'description' => $validated['description'] ?? null,
            ]);

            return ApiResponse::success(
                $softSkill,
                'Habilidad blanda actualizada correctamente.'
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se encontró la habilidad blanda que intentas actualizar.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error actualizando portfolio soft skill', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo actualizar la habilidad blanda. Intenta nuevamente.',
                500,
                null
            );
        }
    }

    public function destroy(int $portfolioId, int $id)
    {
        try {

            $portfolio = $this->getUserPortfolioByIndex($portfolioId);

            $softSkill = PortfolioSoftSkill::with('softSkill')
                ->where('portfolio_id', $portfolio->id)
                ->where('id', $id)
                ->firstOrFail();

            $name = $softSkill->softSkill->name;

            $softSkill->delete();

            return ApiResponse::success(
                null,
                "La habilidad blanda '{$name}' fue eliminada correctamente."
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se encontró la habilidad blanda que intentas eliminar.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error eliminando portfolio soft skill', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo eliminar la habilidad blanda. Intenta nuevamente.',
                500,
                null
            );
        }
    }

    public function publicBySlug($slug)
    {
        $portfolio = Portfolio::where('portfolio_slug', $slug)
            ->firstOrFail();

        $softSkills = $portfolio->softSkills()
            ->with('softSkill')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $softSkills,
            'message' => 'Soft skills obtenidas correctamente',
        ]);
    }
}
