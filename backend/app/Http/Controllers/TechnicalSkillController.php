<?php

namespace App\Http\Controllers;

use App\Models\TechnicalSkill;
use App\Http\Resources\TechnicalSkillResource;
use Illuminate\Http\Request;
use App\Services\ImageUploadService;
use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;

class TechnicalSkillController extends Controller
{
    public function __construct(
        private ImageUploadService $imageUploadService
    ) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $skills = TechnicalSkill::orderBy('name')->get();

        return ApiResponse::success(
            TechnicalSkillResource::collection($skills),
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store()
    {
        $data = request()->validate([
            'name' => 'required|string|max:30',
            'category' => 'required|string|max:30',
            'logo_light' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
            'logo_dark' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
        ]);

        if (request()->hasFile('logo_light')) {
            $logoData = $this->imageUploadService->uploadLogo(request()->file('logo_light'));
            $data['url_light'] = $logoData['url'];
        }

        if (request()->hasFile('logo_dark')) {
            $logoData = $this->imageUploadService->uploadLogo(request()->file('logo_dark'));
            $data['url_dark'] = $logoData['url'];
        }

        $skill = TechnicalSkill::create($data);

        return ApiResponse::success(
            $skill,
            ResponseMessages::CREATED_SUCCESSFULLY
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
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
    public function update(Request $request, int $id)
    {
        $skill = TechnicalSkill::find($id);

        if (!$skill) {
            return response()->json(['message' => 'Habilidad técnica no encontrada.'], 404);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:30',
            'category' => 'sometimes|string|max:30',
            'logo_light' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
            'logo_dark' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
        ]);

        if (request()->hasFile('logo_light')) {
            $logoData = $this->imageUploadService->uploadLogo(request()->file('logo_light'));
            $data['url_light'] = $logoData['url'];
        }

        if (request()->hasFile('logo_dark')) {
            $logoData = $this->imageUploadService->uploadLogo(request()->file('logo_dark'));
            $data['url_dark'] = $logoData['url'];
        }

        $skill->update($data);

        return ApiResponse::success(
            new TechnicalSkillResource($skill),
            ResponseMessages::UPDATED_SUCCESSFULLY
        );
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $skill = TechnicalSkill::find($id);

        if (!$skill) {
            return response()->json(['message' => 'Habilidad técnica no encontrada.'], 404);
        }

        $skill->delete();

        return ApiResponse::success(
            null,
            ResponseMessages::DELETED_SUCCESSFULLY
        );
    }
}
