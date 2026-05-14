<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AcademicStoreRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'institution_name' => 'required|string|max:60',
            'title' => 'required|string|max:60',
            'field_of_study' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'institution_name.required' => 'El nombre de la institución es obligatorio.',
            'institution_name.max' => 'El nombre de la institución tiene un maximo de 60 caracteres.',
            'title.required' => 'El título es obligatorio.',
            'title.max' => 'El título tiene un maximo de 60 caracteres.',
            'field_of_study.required' => 'El campo de estudio es obligatorio.',
            'field_of_study.max' => 'El campo de estudio tiene un maximo de 50 caracteres.',
            'start_date.required' => 'La fecha de inicio es obligatoria.',
            'start_date.date' => 'La fecha de inicio debe ser una fecha válida.',
            'end_date.date' => 'La fecha fin debe ser una fecha válida.',
            'end_date.after' => 'La fecha fin debe ser posterior a la fecha de inicio.',
            'is_current.boolean' => 'El campo "actual" debe ser un valor booleano.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
        ];
    }

    public function failedValidation(validator $validator) 
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors(),
            ], 422));
    }
}
