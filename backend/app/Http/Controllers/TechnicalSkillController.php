<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Http\Resources\TechnicalSkillResource;
use App\Models\TechnicalSkill;
use App\Services\ImageUploadService;

class TechnicalSkillController extends Controller
{
    public function __construct(
        private ImageUploadService $imageUploadService
    ) {}

    public function index()
    {
        $skills = TechnicalSkill::orderBy('name')->get();

        return ApiResponse::success(
            TechnicalSkillResource::collection($skills),
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

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
}
