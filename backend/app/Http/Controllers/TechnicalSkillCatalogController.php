<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Models\TechnicalSkill;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class TechnicalSkillCatalogController extends Controller
{
    public function index(Request $request)
    {
        try {

            $query = TechnicalSkill::query()
                ->withCount('portfolioSkills');

            if ($request->filled('is_active')) {

                $query->where(
                    'is_active',
                    filter_var(
                        $request->is_active,
                        FILTER_VALIDATE_BOOLEAN
                    )
                );
            }

            $technicalSkills = $query
                ->orderBy('name')
                ->get();

            return ApiResponse::success(
                $technicalSkills,
                'Catálogo de habilidades técnicas cargado correctamente.'
            );

        } catch (Throwable $e) {

            Log::error('Error obteniendo catálogo de technical skills', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo cargar el catálogo de habilidades técnicas.',
                500,
                null
            );
        }
    }

    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'name' => 'required|string|max:30',
                'is_active' => 'required|boolean',
            ], [
                'name.required' => 'El nombre de la habilidad es obligatorio.',
                'name.max' => 'El nombre no puede superar los 30 caracteres.',
                'is_active.required' => 'El estado es obligatorio.',
                'is_active.boolean' => 'El estado enviado es inválido.',
            ]);

            $normalizedName = $this->normalize(
                $validated['name']
            );

            $alreadyExists = TechnicalSkill::all()
                ->contains(function ($item) use ($normalizedName) {

                    return $this->normalize($item->name)
                        === $normalizedName;
                });

            if ($alreadyExists) {

                return ApiResponse::error(
                    'Esta habilidad ya existe en el catálogo.',
                    422,
                    null
                );
            }

            $technicalSkill = TechnicalSkill::create([
                'name' => trim($validated['name']),
                'is_active' => $validated['is_active'],
            ]);

            return ApiResponse::success(
                $technicalSkill,
                'Habilidad técnica creada correctamente.',
                201
            );

        } catch (Throwable $e) {

            Log::error('Error creando technical skill del catálogo', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo crear la habilidad del catálogo.',
                500,
                null
            );
        }
    }

    public function update(Request $request, int $id)
    {
        try {

            $technicalSkill = TechnicalSkill::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:30',
                'is_active' => 'required|boolean',
            ], [
                'name.required' => 'El nombre es obligatorio.',
                'name.max' => 'El nombre no puede superar los 30 caracteres.',
                'is_active.required' => 'El estado es obligatorio.',
                'is_active.boolean' => 'El estado enviado es inválido.',
            ]);

            $normalizedName = $this->normalize(
                $validated['name']
            );

            $alreadyExists = TechnicalSkill::where('id', '!=', $id)
                ->get()
                ->contains(function ($item) use ($normalizedName) {

                    return $this->normalize($item->name)
                        === $normalizedName;
                });

            if ($alreadyExists) {

                return ApiResponse::error(
                    'Ya existe una habilidad con ese nombre.',
                    422,
                    null
                );
            }

            $technicalSkill->update([
                'name' => trim($validated['name']),
                'is_active' => $validated['is_active'],
            ]);

            return ApiResponse::success(
                $technicalSkill,
                'Habilidad técnica actualizada correctamente.'
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se encontró la habilidad técnica.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error actualizando technical skill del catálogo', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo actualizar la habilidad del catálogo.',
                500,
                null
            );
        }
    }

    public function toggleStatus($id)
    {
        $skill = TechnicalSkill::find($id);

        if (! $skill) {
            return response()->json([
                'success' => false,
                'message' => 'Habilidad técnica no encontrada.',
            ], 404);
        }

        $skill->is_active = ! $skill->is_active;
        $skill->save();

        $statusName = $skill->is_active ? 'activada' : 'desactivada';

        return response()->json([
            'success' => true,
            'message' => "La habilidad técnica ha sido {$statusName} exitosamente.",
            'data' => $skill,
        ], 200);
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
}
