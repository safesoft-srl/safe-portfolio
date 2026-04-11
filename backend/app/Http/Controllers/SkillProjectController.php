<?php

namespace App\Http\Controllers;

use App\Models\SkillProject;
use Illuminate\Http\Request;
use App\Constants\ResponseMessages;
use App\Constants\ApiResponse;

class SkillProjectController extends Controller
{
   public function store(Request $request)
    {
        $validatedData = $request->validate([
            'skill_name' => 'required|string|max:255',
            'url_logo' => 'nullable|url|max:255',
        ]);

        $skillProject = SkillProject::create($validatedData);

        return response()->json($skillProject, 201);
    }

    public function index()
    {
        $skillProjects = SkillProject::all();

        return ApiResponse::success(
            $skillProjects,
            ResponseMessages::FETCHED_SUCCESSFULLY
        );
    }
}
