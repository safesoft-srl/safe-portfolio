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
    public function index()
    {
        try {

            $softSkills = SoftSkill::orderBy('name')
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
                'name' => 'required|string|max:45|unique:soft_skills,name',
            ], [
                'name.required' => 'El nombre de la habilidad es obligatorio.',
                'name.max' => 'El nombre no puede superar los 45 caracteres.',
                'name.unique' => 'Esta habilidad ya existe en el catálogo.',
            ]);

            if (! $softSkill->is_active) {

                return ApiResponse::error(
                    'Esta habilidad fue desactivada y ya no puede utilizarse.',
                    422,
                    null
                );
            }

            $softSkill = SoftSkill::create([
                'name' => trim($validated['name']),
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
                'name' => 'required|string|max:45|unique:soft_skills,name,'.$id,
            ], [
                'name.required' => 'El nombre es obligatorio.',
                'name.max' => 'El nombre no puede superar los 45 caracteres.',
                'name.unique' => 'Ya existe una habilidad con ese nombre.',
            ]);

            $softSkill->update([
                'name' => trim($validated['name']),
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

    public function destroy(int $id)
    {
        try {

            $softSkill = SoftSkill::findOrFail($id);

            $name = $softSkill->name;

            $softSkill->delete();

            return ApiResponse::success(
                null,
                "La habilidad blanda '{$name}' fue eliminada correctamente."
            );

        } catch (ModelNotFoundException $e) {

            return ApiResponse::error(
                'No se encontró la habilidad blanda que intentas eliminar.',
                404,
                null
            );

        } catch (Throwable $e) {

            Log::error('Error eliminando soft skill del catálogo', [
                'error_message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ApiResponse::error(
                'No se pudo eliminar la habilidad del catálogo.',
                500,
                null
            );
        }
    }
}
