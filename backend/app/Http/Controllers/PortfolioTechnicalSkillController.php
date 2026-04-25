<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Models\Portfolio;
use App\Models\PortfolioSkill;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class PortfolioTechnicalSkillController extends Controller
{
    /**
     * Obtiene el portafolio real del usuario según el número recibido (1,2,3...)
     */
    private function getUserPortfolioByIndex(int $portfolioIndex)
    {
        $user = auth()->user();

        if (!$user) {
            abort(401, 'No autenticado.');
        }

        if ($portfolioIndex < 1) {
            abort(400, 'El portfolioId debe ser mayor o igual a 1.');
        }

        $portfolio = Portfolio::where('user_id', $user->id)
            ->orderBy('id', 'asc')
            ->skip($portfolioIndex - 1)
            ->first();

        if (!$portfolio) {
            abort(404, 'No se encontró el portafolio solicitado para este usuario.');
        }

        return $portfolio;
    }

    public function store(Request $request, int $portfolioId)
    {
        try {

            // portfolioId ahora es índice (1,2,3...)
            $portfolio = $this->getUserPortfolioByIndex($portfolioId);

            $validated = $request->validate([
                'technical_skill_id' => 'required|exists:technical_skills,id',
                'level' => 'required|string|max:50',
            ]);

            $exists = PortfolioSkill::where('portfolio_id', $portfolio->id)
                ->where('technical_skill_id', $validated['technical_skill_id'])
                ->exists();

            if ($exists) {
                return ApiResponse::error(
                    'Esta habilidad ya está agregada en tu portafolio.',
                    409,
                    null
                );
            }

            $skill = PortfolioSkill::create([
                'portfolio_id' => $portfolio->id,
                'technical_skill_id' => $validated['technical_skill_id'],
                'level' => $validated['level'],
            ]);

            return ApiResponse::success(
                $skill,
                'Habilidad agregada correctamente a tu portafolio.',
                201
            );

        } catch (Throwable $e) {

            Log::error('Error creando skill del portafolio', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo agregar la habilidad. Intenta nuevamente más tarde.',
                500,
                null
            );
        }
    }

    public function update(Request $request, int $portfolioId)
    {
        try {

            $portfolio = $this->getUserPortfolioByIndex($portfolioId);

            $validated = $request->validate([
                'technical_skill_id' => 'required|exists:technical_skills,id',
                'level' => 'required|string|max:50',
            ]);

            $portfolioSkill = PortfolioSkill::where('portfolio_id', $portfolio->id)
                ->where('technical_skill_id', $validated['technical_skill_id'])
                ->firstOrFail();

            $oldLevel = $portfolioSkill->level;

            $portfolioSkill->update([
                'level' => $validated['level'],
            ]);

            return ApiResponse::success(
                $portfolioSkill,
                "Nivel actualizado de '{$oldLevel}' a '{$validated['level']}' correctamente ✔"
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se encontró esta habilidad en tu portafolio.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error actualizando skill del portafolio', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'Error al actualizar la habilidad. Intenta nuevamente.',
                500,
                null
            );
        }
    }

    public function destroy(Request $request, int $portfolioId)
    {
        try {

            $portfolio = $this->getUserPortfolioByIndex($portfolioId);

            $validated = $request->validate([
                'technical_skill_id' => 'required|exists:technical_skills,id',
            ]);

            $portfolioSkill = PortfolioSkill::where('portfolio_id', $portfolio->id)
                ->where('technical_skill_id', $validated['technical_skill_id'])
                ->firstOrFail();

            $name = $portfolioSkill->technicalSkill->name ?? 'la habilidad';

            $portfolioSkill->delete();

            return ApiResponse::success(
                null,
                "La habilidad '{$name}' fue eliminada correctamente del portafolio 🗑"
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se pudo encontrar la habilidad que intentas eliminar.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error eliminando skill del portafolio', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'Error al eliminar la habilidad. Intenta nuevamente.',
                500,
                null
            );
        }
    }

    public function index(int $portfolioId)
    {
        try {

            $portfolio = $this->getUserPortfolioByIndex($portfolioId);

            $skills = PortfolioSkill::where('portfolio_id', $portfolio->id)
                ->with('technicalSkill')
                ->get();

            return ApiResponse::success(
                $skills,
                'Habilidades cargadas correctamente'
            );

        } catch (Throwable $e) {

            Log::error('Error obteniendo technical skills', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'Error al cargar las habilidades. Intenta nuevamente más tarde.',
                500,
                null
            );
        }
    }
}
