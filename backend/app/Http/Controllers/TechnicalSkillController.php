<?php

namespace App\Http\Controllers;

use App\Models\TechnicalSkill;
use App\Http\Resources\TechnicalSkillResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TechnicalSkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $skills = TechnicalSkill::all();
        // Usamos el Resource que actualizamos para que envíe 'urls' y 'is_active'
        return TechnicalSkillResource::collection($skills);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'logo_light' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'logo_dark' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $skill = new TechnicalSkill();
        $skill->name = $request->name;
        $skill->category = $request->category;
        $skill->is_active = true; // Por defecto al crear, está activa

        // Manejo de la imagen clara
        if ($request->hasFile('logo_light')) {
            $path = $request->file('logo_light')->store('technical-skills', 'public');
            $skill->url_light = url('storage/' . $path);
        }

        // Manejo de la imagen oscura
        if ($request->hasFile('logo_dark')) {
            $path = $request->file('logo_dark')->store('technical-skills', 'public');
            $skill->url_dark = url('storage/' . $path);
        }

        $skill->save();

        return response()->json([
            'success' => true,
            'message' => 'Habilidad creada exitosamente.',
            'data' => new TechnicalSkillResource($skill)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $skill = TechnicalSkill::find($id);

        if (!$skill) {
            return response()->json(['message' => 'Habilidad técnica no encontrada.'], 404);
        }

        return new TechnicalSkillResource($skill);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $skill = TechnicalSkill::find($id);

        if (!$skill) {
            return response()->json(['message' => 'Habilidad técnica no encontrada.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'logo_light' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'logo_dark' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Actualizamos los campos de texto si vienen en la petición
        if ($request->has('name')) {
            $skill->name = $request->name;
        }
        if ($request->has('category')) {
            $skill->category = $request->category;
        }

        // --- MANEJO DE ACTUALIZACIÓN DE IMÁGENES ---

        if ($request->hasFile('logo_light')) {
            // Opcional: Eliminar la imagen anterior del servidor para no acumular basura
            if ($skill->url_light) {
                $oldPath = str_replace(url('storage/') . '/', '', $skill->url_light);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('logo_light')->store('technical-skills', 'public');
            $skill->url_light = url('storage/' . $path);
        }

        if ($request->hasFile('logo_dark')) {
            // Opcional: Eliminar la imagen anterior del servidor
            if ($skill->url_dark) {
                $oldPath = str_replace(url('storage/') . '/', '', $skill->url_dark);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('logo_dark')->store('technical-skills', 'public');
            $skill->url_dark = url('storage/' . $path);
        }

        $skill->save();

        return response()->json([
            'success' => true,
            'message' => 'Habilidad actualizada exitosamente.',
            'data' => new TechnicalSkillResource($skill)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $skill = TechnicalSkill::find($id);

        if (!$skill) {
            return response()->json(['message' => 'Habilidad técnica no encontrada.'], 404);
        }

        // Eliminamos las imágenes asociadas del servidor
        if ($skill->url_light) {
            $oldPath = str_replace(url('storage/') . '/', '', $skill->url_light);
            Storage::disk('public')->delete($oldPath);
        }

        if ($skill->url_dark) {
            $oldPath = str_replace(url('storage/') . '/', '', $skill->url_dark);
            Storage::disk('public')->delete($oldPath);
        }

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Habilidad técnica eliminada permanentemente.'
        ]);
    }
}