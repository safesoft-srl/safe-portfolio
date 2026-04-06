<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Todos pueden intentar loguearse (true)
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
            'email' => 'required|string',
            'password' => 'required|string',
        ];
    }

    /**
     * Obtener los mensajes de error de validación personalizados en español.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'El campo usuario o correo es obligatorio.',
            'email.string' => 'El campo usuario o correo debe ser un texto.',
            'password.required' => 'El campo contraseña es obligatorio.',
            'password.string' => 'La contraseña debe ser un texto.',
        ];
    }
}
