<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Models\SoftSkill;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class SoftSkillCatalogController extends Controller
{
    public function index(Request $request)
    {
        try {

            $query = SoftSkill::query()
                ->withCount('portfolioSoftSkills');

            if ($request->filled('is_active')) {

                $query->where(
                    'is_active',
                    filter_var(
                        $request->is_active,
                        FILTER_VALIDATE_BOOLEAN
                    )
                );
            }

            $softSkills = $query
                ->orderBy('name')
                ->get();

            return ApiResponse::success(
                $softSkills,
                'Catálogo de habilidades blandas cargado correctamente.'
            );

        } catch (Throwable $e) {

            Log::error('Error obteniendo catálogo de soft skills', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo cargar el catálogo de habilidades blandas.',
                500,
                null
            );
        }
    }

    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'name' => 'required|string|max:45',
                'is_active' => 'required|boolean',
            ], [
                'name.required' => 'El nombre de la habilidad es obligatorio.',
                'name.max' => 'El nombre no puede superar los 45 caracteres.',
                'is_active.required' => 'El estado es obligatorio.',
                'is_active.boolean' => 'El estado enviado es inválido.',
            ]);

            $normalizedName = $this->normalize(
                $validated['name']
            );

            $alreadyExists = SoftSkill::all()
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

            $softSkill = SoftSkill::create([
                'name' => trim($validated['name']),
                'is_active' => $validated['is_active'],
            ]);

            return ApiResponse::success(
                $softSkill,
                'Habilidad blanda creada correctamente.',
                201
            );

        } catch (Throwable $e) {

            Log::error('Error creando soft skill del catálogo', [
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

            $softSkill = SoftSkill::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:45',
                'is_active' => 'required|boolean',
            ], [
                'name.required' => 'El nombre es obligatorio.',
                'name.max' => 'El nombre no puede superar los 45 caracteres.',
                'is_active.required' => 'El estado es obligatorio.',
                'is_active.boolean' => 'El estado enviado es inválido.',
            ]);

            $normalizedName = $this->normalize(
                $validated['name']
            );

            $alreadyExists = SoftSkill::where('id', '!=', $id)
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

            $softSkill->update([
                'name' => trim($validated['name']),
                'is_active' => $validated['is_active'],
            ]);

            return ApiResponse::success(
                $softSkill,
                'Habilidad blanda actualizada correctamente.'
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se encontró la habilidad blanda.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error actualizando soft skill del catálogo', [
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

    public function toggleStatus(int $id)
    {
        try {

            $softSkill = SoftSkill::withCount(
                'portfolioSoftSkills'
            )->findOrFail($id);

            $affectedUsers =
                $softSkill->portfolio_soft_skills_count;

            $newStatus = ! $softSkill->is_active;

            $softSkill->update([
                'is_active' => $newStatus,
            ]);

            $message = $newStatus
                ? 'Habilidad blanda activada correctamente.'
                : 'Habilidad blanda desactivada correctamente.';

            return ApiResponse::success([
                'skill' => $softSkill,
                'affected_users' => $affectedUsers,
                'is_active' => $newStatus,
            ], $message);

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se encontró la habilidad blanda.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error cambiando estado de soft skill', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo cambiar el estado de la habilidad.',
                500,
                null
            );
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
}
