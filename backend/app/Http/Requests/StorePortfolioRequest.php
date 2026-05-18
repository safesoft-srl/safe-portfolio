<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePortfolioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'url_portfolio' => 'sometimes|nullable|string',
            'profile_name' => 'required|string|max:255',
            'profile_email' => 'required|email',
            'profession' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'portfolio_name'=> 'nullable|string|max:255',
            'portfolio_descrition' => 'nullable|string',
            'phone' => 'nullable|string|max:10',
            'city'=> 'nullable|string|max:50',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image_id' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'profile_name.required' => 'El nombre del perfil es obligatorio.',
            'profile_email.required' => 'El correo electrónico del perfil es obligatorio.',
            'profession.required' => 'La profesión es obligatoria.',
            'profile_image.image' => 'El archivo debe ser una imagen.',
            'profile_image.mimes' => 'La imagen debe ser un archivo de tipo: jpg, jpeg, png.',
            'profile_image.max' => 'La imagen no debe superar los 2MB.',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422));
    }
}
