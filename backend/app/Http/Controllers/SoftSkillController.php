<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Models\SoftSkill;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class SoftSkillController extends Controller
{
    /**
     * Obtiene el portafolio real del usuario según el número recibido (1,2,3...)
     */
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

            $softSkills = SoftSkill::where('portfolio_id', $portfolio->id)
                ->orderBy('id', 'desc')
                ->get();

            return ApiResponse::success(
                $softSkills,
                'Habilidades blandas cargadas correctamente.'
            );

        } catch (Throwable $e) {

            Log::error('Error obteniendo soft skills', [
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
                'name' => 'required|string|max:45',
                'description' => 'nullable|string|max:255',
            ], [
                'name.required' => 'El nombre de la habilidad es obligatorio.',
                'name.max' => 'El nombre no puede superar los 45 caracteres.',
                'description.max' => 'La descripción no puede superar los 255 caracteres.',
            ]);

            $exists = SoftSkill::where('portfolio_id', $portfolio->id)
                ->whereRaw('LOWER(name) = ?', [strtolower($validated['name'])])
                ->exists();

            if ($exists) {
                return ApiResponse::error(
                    'Ya tienes registrada esta habilidad blanda en tu portafolio.',
                    409,
                    null
                );
            }

            $softSkill = SoftSkill::create([
                'portfolio_id' => $portfolio->id,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            return ApiResponse::success(
                $softSkill,
                'Habilidad blanda creada correctamente.',
                201
            );

        } catch (Throwable $e) {

            Log::error('Error creando soft skill', [
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

            $softSkill = SoftSkill::where('portfolio_id', $portfolio->id)
                ->where('id', $id)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'required|string|max:45',
                'description' => 'nullable|string|max:255',
            ], [
                'name.required' => 'El nombre de la habilidad es obligatorio.',
                'name.max' => 'El nombre no puede superar los 45 caracteres.',
                'description.max' => 'La descripción no puede superar los 255 caracteres.',
            ]);

            $exists = SoftSkill::where('portfolio_id', $portfolio->id)
                ->whereRaw('LOWER(name) = ?', [strtolower($validated['name'])])
                ->where('id', '!=', $softSkill->id)
                ->exists();

            if ($exists) {
                return ApiResponse::error(
                    'Ya existe otra habilidad con ese nombre en tu portafolio.',
                    409,
                    null
                );
            }

            $softSkill->update([
                'name' => $validated['name'],
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

            Log::error('Error actualizando soft skill', [
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

            $softSkill = SoftSkill::where('portfolio_id', $portfolio->id)
                ->where('id', $id)
                ->firstOrFail();

            $name = $softSkill->name;

            $softSkill->delete();

            return ApiResponse::success(
                null,
                "La habilidad blanda '{$name}' fue eliminada correctamente 🗑"
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se encontró la habilidad blanda que intentas eliminar.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error eliminando soft skill', [
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
        $portfolio = \App\Models\Portfolio::where('portfolio_slug', $slug)->firstOrFail();

        $softSkills = $portfolio->softSkills()->get();

        return response()->json([
            'success' => true,
            'data' => $softSkills,
            'message' => 'Soft skills obtenidas correctamente',
        ]);
    }
}
