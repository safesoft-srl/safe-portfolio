<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WorkExperience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class WorkExperienceReportController extends Controller
{
    /**
     * Genera un reporte analítico de las experiencias laborales de la plataforma.
     * Incorpora caché inteligente y normalización de texto por SQL.
     */
    public function index(Request $request)
    {
        // Caché dinámico basado en los filtros solicitados por 15 minutos
        $cacheKey = 'work_exp_report_'.md5(json_encode($request->all()));

        return Cache::remember($cacheKey, now()->addMinutes(15), function () use ($request) {
            $baseQuery = WorkExperience::query();

            // 1. Aplicar Filtros de Estado
            if ($request->filled('status')) {
                if ($request->status === 'current') {
                    $baseQuery->where('is_current', true);
                } elseif ($request->status === 'past') {
                    $baseQuery->where('is_current', false);
                }
            }

            // 2. Aplicar Filtros de Fecha (Fecha en que se registró en la plataforma)
            if ($request->filled('created_period')) {
                switch ($request->created_period) {
                    case 'week':
                        $baseQuery->where('created_at', '>=', now()->subWeek());
                        break;
                    case 'month':
                        $baseQuery->where('created_at', '>=', now()->subMonth());
                        break;
                    case 'year':
                        $baseQuery->where('created_at', '>=', now()->subYear());
                        break;
                }
            }
            if ($request->filled('date_from') && $request->filled('date_to')) {
                $baseQuery->whereBetween('created_at', [
                    $request->date_from.' 00:00:00',
                    $request->date_to.' 23:59:59',
                ]);
            }

            // Clonar consulta para estadísticas
            $statsQuery = clone $baseQuery;

            // --- A. SUMMARY (Resumen Estadístico) ---
            $totalExperiences = $statsQuery->count();
            $currentlyWorking = (clone $statsQuery)->where('is_current', true)->count();

            $summary = [
                'total_experiences' => $totalExperiences,
                'currently_working' => $currentlyWorking,
                'past_jobs' => $totalExperiences - $currentlyWorking,
                'cached_at' => now()->toIso8601String(),
            ];

            // --- B. MONTHLY TREND (Distribución Histórica) ---
            // Agrupar por Mes y Año (Ej: "2026-05")
            // Usamos formato compatible con la mayoría de motores SQL
            $trendQuery = clone $baseQuery;
            $monthlyTrend = $trendQuery
                ->select(DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"), DB::raw('COUNT(*) as count'))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->get();

            // Si no hay filtros de fecha, limitamos la gráfica a los últimos 6 meses por defecto en código PHP
            if (! $request->filled('created_period') && ! $request->filled('date_from')) {
                $monthlyTrend = $monthlyTrend->take(-6)->values(); // Tomar los últimos 6
            }

            // --- C. TOP POSITIONS & COMPANIES (Normalización SQL) ---
            // LOWER(TRIM()) para evitar fragmentación (Manager vs manager vs manager )
            $topPositionsQuery = clone $baseQuery;
            $topPositions = $topPositionsQuery
                ->select(DB::raw('LOWER(TRIM(position)) as normalized_position'), DB::raw('COUNT(*) as count'))
                ->groupBy('normalized_position')
                ->orderByDesc('count')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'position' => mb_convert_case($item->normalized_position, MB_CASE_TITLE, 'UTF-8'),
                        'count' => $item->count,
                    ];
                });

            $topCompaniesQuery = clone $baseQuery;
            $topCompanies = $topCompaniesQuery
                ->select(DB::raw('LOWER(TRIM(company)) as normalized_company'), DB::raw('COUNT(*) as count'))
                ->groupBy('normalized_company')
                ->orderByDesc('count')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'company' => mb_convert_case($item->normalized_company, MB_CASE_TITLE, 'UTF-8'),
                        'count' => $item->count,
                    ];
                });

            // --- D. DETAILED LIST (Lista Cruda) ---
            // Cargamos la relación con el portafolio para extraer datos del usuario
            $detailedQuery = clone $baseQuery;
            $detailedList = $detailedQuery
                ->with(['portfolio:id,profile_name'])
                ->orderByDesc('created_at')
                ->limit(100) // Límite de seguridad para evitar PDFs gigantescos
                ->get()
                ->map(function ($experience) {
                    return [
                        'id' => $experience->id,
                        'user_name' => $experience->portfolio->profile_name ?? 'Usuario Desconocido',
                        'company' => $experience->company,
                        'position' => $experience->position,
                        'start_date' => $experience->start_date ? $experience->start_date->format('Y-m-d') : null,
                        'end_date' => $experience->end_date ? $experience->end_date->format('Y-m-d') : null,
                        'is_current' => $experience->is_current,
                        'created_at' => $experience->created_at->toIso8601String(),
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Reporte de experiencias laborales generado correctamente.',
                'data' => [
                    'summary' => $summary,
                    'monthly_trend' => $monthlyTrend,
                    'top_positions' => $topPositions,
                    'top_companies' => $topCompanies,
                    'detailed_list' => $detailedList,
                ],
            ]);
        });
    }
}
