<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
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
            $skills,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }

    public function store()
    {
        $data = request()->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'logo' => 'nullable|file|mimes:jpg,jpeg,png,svg|max:2048',
        ]);

        if (request()->hasFile('logo')) {
            $logoData = $this->imageUploadService->uploadLogo(request()->file('logo'));
            $data['icon_path'] = $logoData['url'];
        }

        $skill = TechnicalSkill::create($data);

        return ApiResponse::success(
            $skill,
            ResponseMessages::CREATED_SUCCESSFULLY
        );
    }
}
