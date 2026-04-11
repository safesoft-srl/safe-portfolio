<?php

namespace App\Http\Requests;

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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'portfolio_id' => 'required|exists:portfolios,id',
            'name' => 'required|string|max:100',
            'description' => 'required|string',
            'url_demo' => 'nullable|url',
            'url_github' => 'nullable|url',
            'project_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'skill_ids'=> 'nullable|array',
            'skill_ids.*' => 'exists:skill_projects,id',
        ];
    }
}
