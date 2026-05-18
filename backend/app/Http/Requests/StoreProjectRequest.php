<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'portfolio_id' => 'required|exists:portfolios,id',
            'name' => 'required|string|max:100',
            'description' => 'required|string',
            'url_demo' => 'nullable|url',
            'url_github' => 'nullable|url',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'current'=> 'boolean',
            'category' => 'nullable|string|max:50',
            'project_image' => 'nullable|image|mimes:jpg,jpeg,png',
            'skill_ids' => 'nullable|array',
            'skill_ids.*' => 'exists:technical_skills,id',
            'visible' => 'boolean',
        ];
    }
}
