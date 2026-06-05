<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Models\SoftSkill;
use App\Models\SoftSkillRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class SoftSkillReportController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = SoftSkill::query()->withCount('portfolioSoftSkills');
            if ($request->filled('status')) {
                if ($request->status === 'active') {
                    $query->where('is_active', true);
                }
                if ($request->status === 'inactive') {
                    $query->where('is_active', false);
                }
            }
            if ($request->filled('created_period')) {
                switch ($request->created_period) {
                    case 'week': $query->where('created_at', '>=', now()->subWeek());
                        break;
                    case 'month': $query->where('created_at', '>=', now()->subDays(30));
                        break;
                    case 'year': $query->where('created_at', '>=', now()->subYear());
                        break;
                }
            }
            if ($request->filled('date_from') && $request->filled('date_to')) {
                $query->whereBetween('created_at', [$request->date_from.' 00:00:00', $request->date_to.' 23:59:59']);
            }
            $useOrder = $request->get('use_order', 'desc');
            if ($useOrder === 'asc') {
                $query->orderBy('portfolio_soft_skills_count');
            } else {
                $query->orderByDesc('portfolio_soft_skills_count');
            }
            $query->orderBy('name');
            $limit = $request->get('limit');
            if ($limit && is_numeric($limit) && (int) $limit > 0) {
                $query->limit((int) $limit);
            }
            $skills = $query->get();
            $summary = [
                'results' => $skills->count(),
                'active' => $skills->where('is_active', true)->count(),
                'inactive' => $skills->where('is_active', false)->count(),
                'total_uses' => $skills->sum('portfolio_soft_skills_count'),
            ];
            $table = $skills->map(function ($skill) {
                return [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'is_active' => $skill->is_active,
                    'uses' => $skill->portfolio_soft_skills_count,
                    'created_at' => $skill->created_at,
                ];
            });

            return ApiResponse::success(['summary' => $summary, 'skills' => $table], 'Reporte generado correctamente.');
        } catch (Throwable $e) {
            Log::error('Error generando reporte de habilidades blandas', ['error_message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return ApiResponse::error('No se pudo generar el reporte.', 500, null);
        }
    }

    public function requestReport(Request $request)
    {
        try {
            $query = SoftSkillRequest::query();
            if ($request->filled('status')) {
                if (in_array($request->status, ['pending', 'approved', 'rejected'])) {
                    $query->where('status', $request->status);
                }
            }
            if ($request->filled('created_period')) {
                switch ($request->created_period) {
                    case 'week': $query->where('created_at', '>=', now()->subWeek());
                        break;
                    case 'month': $query->where('created_at', '>=', now()->subDays(30));
                        break;
                    case 'year': $query->where('created_at', '>=', now()->subYear());
                        break;
                }
            }
            if ($request->filled('date_from') && $request->filled('date_to')) {
                $query->whereBetween('created_at', [$request->date_from.' 00:00:00', $request->date_to.' 23:59:59']);
            }
            $requests = $query->get();
            $grouped = [];
            foreach ($requests as $item) {
                $normalized = $this->normalize($item->name);
                if (! isset($grouped[$normalized])) {
                    $grouped[$normalized] = [
                        'name' => $this->formatDisplayName($normalized),
                        'status' => $item->status,
                        'requests_count' => 0,
                        'created_at' => $item->created_at,
                    ];
                }
                $grouped[$normalized]['requests_count']++;
                if ($item->created_at < $grouped[$normalized]['created_at']) {
                    $grouped[$normalized]['created_at'] = $item->created_at;
                }
            }
            $requests = collect(array_values($grouped));
            $requestOrder = $request->get('request_order', 'desc');
            if ($requestOrder === 'asc') {
                $requests = $requests->sortBy('requests_count');
            } else {
                $requests = $requests->sortByDesc('requests_count');
            }
            $limit = $request->get('limit');
            if ($limit && is_numeric($limit) && (int) $limit > 0) {
                $requests = $requests->take((int) $limit);
            }
            $summary = [
                'results' => $requests->count(),
                'pending' => $requests->where('status', 'pending')->count(),
                'approved' => $requests->where('status', 'approved')->count(),
                'rejected' => $requests->where('status', 'rejected')->count(),
            ];

            return ApiResponse::success([
                'summary' => $summary,
                'requests' => $requests->values(),
            ], 'Reporte generado correctamente.');
        } catch (Throwable $e) {
            Log::error('Error generando reporte de solicitudes', ['error_message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return ApiResponse::error('No se pudo generar el reporte.', 500, null);
        }
    }

    private function normalize($text)
    {
        $text = mb_strtolower($text, 'UTF-8');

        $replacements = [
            'á' => 'a',
            'é' => 'e',
            'í' => 'i',
            'ó' => 'o',
            'ú' => 'u',
            'à' => 'a',
            'è' => 'e',
            'ì' => 'i',
            'ò' => 'o',
            'ù' => 'u',
        ];

        return strtr(trim($text), $replacements);
    }

    private function formatDisplayName($text)
    {
        return mb_convert_case(
            $text,
            MB_CASE_TITLE,
            'UTF-8'
        );
    }
}
