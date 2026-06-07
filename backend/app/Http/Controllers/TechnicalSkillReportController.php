<?php

namespace App\Http\Controllers;

use App\Models\TechnicalSkill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TechnicalSkillReportController extends Controller
{
    public function index()
{
    $total = TechnicalSkill::count();
    $active = TechnicalSkill::where('is_active', true)->count();
    $inactive = TechnicalSkill::where('is_active', false)->count();

    $byCategory = TechnicalSkill::selectRaw('category, count(*) as total')
        ->groupBy('category')
        ->get();

    return response()->json([
        'success' => true,
        'data' => [
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'categories' => $byCategory,
            'most_used' => [] 
        ]
    ]);
}
}