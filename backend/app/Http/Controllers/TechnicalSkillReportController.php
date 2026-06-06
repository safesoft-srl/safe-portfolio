<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Models\TechnicalSkill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class TechnicalSkillReportController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = TechnicalSkill::query()
                ->withCount('portfolioSkills')
                ->with('portfolioSkills');

            // Estado
            if ($request->filled('status')) {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                }

                if ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }

            // Categoría
            if ($request->filled('category')) {
                $query->where('category', $request->category);
            }

            // Uso
            if ($request->filled('usage')) {
                if ($request->usage === 'used') {
                    $query->has('portfolioSkills');
                }

                if ($request->usage === 'unused') {
                    $query->doesntHave('portfolioSkills');
                }
            }

            // Búsqueda
            if ($request->filled('search')) {
                $search = mb_strtolower(
                    trim($request->search),
                    'UTF-8'
                );

                $query->whereRaw(
                    'LOWER(name) LIKE ?',
                    ['%'.$search.'%']
                );
            }

            // Orden por uso
            $useOrder = $request->get('use_order', 'desc');

            if ($useOrder === 'asc') {
                $query->orderBy('portfolio_skills_count');
            } else {
                $query->orderByDesc('portfolio_skills_count');
            }

            // Orden secundario
            $query->orderBy('name');

            // Límite
            $limit = $request->get('limit');

            if (
                $limit &&
                is_numeric($limit) &&
                (int) $limit > 0
            ) {
                $query->limit((int) $limit);
            }

            $skills = $query->get();

            $summary = [
                'results' => $skills->count(),
                'active' => $skills->where('is_active', true)->count(),
                'inactive' => $skills->where('is_active', false)->count(),
                'total_uses' => $skills->sum('portfolio_skills_count'),
            ];

            $table = $skills->map(function ($skill) {

                $totalLevels = $skill->portfolioSkills->count();

                $beginner = $skill->portfolioSkills
                    ->where('level', 'Principiante')
                    ->count();

                $intermediate = $skill->portfolioSkills
                    ->where('level', 'Intermedio')
                    ->count();

                $advanced = $skill->portfolioSkills
                    ->where('level', 'Avanzado')
                    ->count();

                return [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'category' => $skill->category,
                    'is_active' => $skill->is_active,
                    'uses' => $skill->portfolio_skills_count,

                    'beginner_percentage' => $totalLevels > 0
                        ? round(($beginner * 100) / $totalLevels, 1)
                        : 0,

                    'intermediate_percentage' => $totalLevels > 0
                        ? round(($intermediate * 100) / $totalLevels, 1)
                        : 0,

                    'advanced_percentage' => $totalLevels > 0
                        ? round(($advanced * 100) / $totalLevels, 1)
                        : 0,

                    'created_at' => $skill->created_at,
                ];
            });

            return ApiResponse::success(
                [
                    'summary' => $summary,
                    'skills' => $table,
                ],
                'Reporte generado correctamente.'
            );
        } catch (Throwable $e) {
            Log::error(
                'Error generando reporte de habilidades técnicas',
                [
                    'error_message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]
            );

            return ApiResponse::error(
                'No se pudo generar el reporte.',
                500,
                null
            );
        }
    }
}
