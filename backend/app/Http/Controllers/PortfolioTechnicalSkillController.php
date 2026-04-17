<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Models\PortfolioSkill;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use App\Models\Portfolio;
use Throwable;

class PortfolioTechnicalSkillController extends Controller
{

    public function store(Request $request, int $portfolioId)
    {
        Portfolio::findOrFail($portfolioId);

        $validated = $request->validate([
            'technical_skill_id' => 'required|exists:technical_skills,id',
            'level' => 'required|string|max:50',
        ]);

        try {

            $exists = PortfolioSkill::where('portfolio_id', $portfolioId)
                ->where('technical_skill_id', $validated['technical_skill_id'])
                ->exists();

            if ($exists) {
                return ApiResponse::error(
                    "Esta habilidad ya está agregada en tu portafolio. ",
                    409,
                    null
                );
            }

            $skill = PortfolioSkill::create([
                'portfolio_id' => $portfolioId,
                'technical_skill_id' => $validated['technical_skill_id'],
                'level' => $validated['level'],
            ]);

            return ApiResponse::success(
                $skill,
                "Habilidad agregada correctamente a tu portafolio ",
                201
            );

        } catch (Throwable $e) {

            Log::error('Error creando skill del portafolio', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                "No se pudo agregar la habilidad. Intenta nuevamente más tarde.",
                500,
                null
            );
        }
    }






    public function update(Request $request, int $portfolioId)
    {
        Portfolio::findOrFail($portfolioId);

        $validated = $request->validate([
            'technical_skill_id' => 'required|exists:technical_skills,id',
            'level' => 'required|string|max:50',
        ]);

        try {

            $portfolioSkill = PortfolioSkill::where('portfolio_id', $portfolioId)
                ->where('technical_skill_id', $validated['technical_skill_id'])
                ->firstOrFail();

            $oldLevel = $portfolioSkill->level;

            $portfolioSkill->update([
                'level' => $validated['level']
            ]);

            return ApiResponse::success(
                $portfolioSkill,
                "Nivel actualizado de '{$oldLevel}' a '{$validated['level']}' correctamente ✔"
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                "No se encontró esta habilidad en tu portafolio.",
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error actualizando skill del portafolio', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                "Error al actualizar la habilidad. Intenta nuevamente.",
                500,
                null
            );
        }
    }






    public function destroy(Request $request, int $portfolioId)
    {
        Portfolio::findOrFail($portfolioId);

        $validated = $request->validate([
            'technical_skill_id' => 'required|exists:technical_skills,id',
        ]);

        try {

            $portfolioSkill = PortfolioSkill::where('portfolio_id', $portfolioId)
                ->where('technical_skill_id', $validated['technical_skill_id'])
                ->firstOrFail();

            $name = $portfolioSkill->technicalSkill->name ?? "la habilidad";

            $portfolioSkill->delete();

            return ApiResponse::success(
                null,
                "La habilidad '{$name}' fue eliminada correctamente del portafolio 🗑"
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                "No se pudo encontrar la habilidad que intentas eliminar.",
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error eliminando skill del portafolio', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                "Error al eliminar la habilidad. Intenta nuevamente.",
                500,
                null
            );
        }
    }






    public function index(int $portfolioId)
    {
        try {

            Portfolio::findOrFail($portfolioId);

            $skills = PortfolioSkill::where('portfolio_id', $portfolioId)
                ->with('technicalSkill')
                ->get();

            return ApiResponse::success(
                $skills,
                "Habilidades cargadas correctamente "
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                "No se encontró el portafolio solicitado.",
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error("Error obteniendo technical skills", [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                "Error al cargar las habilidades. Intenta nuevamente más tarde.",
                500,
                null
            );
        }
    }
}
