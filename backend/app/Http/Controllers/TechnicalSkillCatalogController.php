<?php

namespace App\Http\Controllers;

use App\Models\TechnicalSkill;
use Illuminate\Http\Request;

class TechnicalSkillCatalogController extends Controller
{
  
    public function toggleStatus($id)
    {
        // Buscamos la habilidad por su ID
        $skill = TechnicalSkill::find($id);

        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Habilidad técnica no encontrada.'
            ], 404);
        }

        // Invertimos el estado actual (si es true pasa a false, si es false a true)
        $skill->is_active = !$skill->is_active;
        $skill->save();

        $statusName = $skill->is_active ? 'activada' : 'desactivada';

        return response()->json([
            'success' => true,
            'message' => "La habilidad técnica ha sido {$statusName} exitosamente.",
            'data' => $skill
        ], 200);
    }
}