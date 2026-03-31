<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePortfolioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'url_portfolio' => 'sometimes|string',
            'profile_name' => 'sometimes|string|max:255',
            'profile_email' => 'sometimes|email',
            'profession' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|string',
        ];
    }
}
