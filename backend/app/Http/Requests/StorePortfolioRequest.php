<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePortfolioRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'url_portfolio' => 'string|unique:portfolios',
            'profile_name' => 'required|string|max:255',
            'profile_email' => 'required|email',
            'profession' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|string'
        ];
    }
}
