<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProyectRequest extends FormRequest
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
            'name' => 'sometimes|string|max:100',
            'description' => 'sometimes|string',
            'url_demo' => 'nullable|url',
            'url_github' => 'nullable|url',
            'project_image' => 'nullable|image|mimes:jpg,jpeg,png',
            'skill_ids' => 'nullable|array',
            'skill_ids.*' => 'exists:skill_projects,id',
        ];
    }
}
