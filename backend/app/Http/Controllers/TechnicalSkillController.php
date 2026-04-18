<?php

namespace App\Http\Controllers;

use App\Constants\ApiResponse;
use App\Constants\ResponseMessages;
use App\Models\TechnicalSkill;

class TechnicalSkillController extends Controller
{
    public function index()
    {
        $skills = TechnicalSkill::orderBy('name')->get();

        return ApiResponse::success(
            $skills,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }
}
