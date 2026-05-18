<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdatePortfolioRequest extends FormRequest
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
            'id_portfolio' => 'required|numeric|exists:portfolios,id',
            'url_portfolio' => 'sometimes|nullable|string',
            'profile_name' => 'sometimes|string|max:255',
            'profile_email' => 'sometimes|email',
            'profession' => 'sometimes|string|max:255',
            'bio' => 'nullable|string',
            'portfolio_name'=> 'nullable|string|max:50',
            'portfolio_descrition' => 'nullable|string',
            'telephone' => 'nullable|string|max:10',
            'city'=> 'nullable|string|max:50',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image_id' => 'nullable|string',
            'github_username' => ['sometimes', 'nullable', 'string', 'max:39', 'regex:/^[a-zA-Z0-9\-]+$/'],
            'linkedin_url' => ['sometimes', 'nullable', 'url', 'regex:/linkedin\.com\/in\//'],
        ];
    }

    public function messages(): array
    {
        return [
            'id_portfolio.required' => 'El ID del portafolio es obligatorio.',
            'id_portfolio.exists' => 'El ID del portafolio no existe.',
            'profile_name.string' => 'El nombre del perfil debe ser una cadena de texto.',
            'profile_name.max' => 'El nombre del perfil no debe superar los 255 caracteres.',
            'profile_email.email' => 'El correo electrónico del perfil debe ser una dirección de correo válida.',
            'profession.string' => 'La profesión debe ser una cadena de texto.',
            'profession.max' => 'La profesión no debe superar los 255 caracteres.',
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
