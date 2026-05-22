<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateCourseRequest extends FormRequest
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
            'institution_name' => 'sometimes|string|max:60',
            'title' => 'sometimes|string|max:60',
            'area' => 'sometimes|string|max:50',
            'workload_hours' => 'nullable|string|max:10',
            'level' => 'nullable|string|max:30',
            'certificate_date' => 'nullable|date|after:current_date',
            'is_current' => 'boolean',
            'is_visible' => 'boolean',
            'description' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'institution_name.max' => 'El nombre de la institución tiene un maximo de 60 caracteres.',
            'title.max' => 'El título tiene un maximo de 60 caracteres.',
            'area.max' => 'El área tiene un maximo de 50 caracteres.',
            'workload_hours.max' => 'Las horas de carga tienen un maximo de 10 caracteres.',
            'level.max' => 'El nivel tiene un maximo de 30 caracteres.',
            'certificate_date.date' => 'La fecha de emisión debe ser una fecha válida.',
            'certificate_date.after' => 'La fecha de emisión debe ser anterior a la fecha actual.',
            'is_current.boolean' => 'El campo "actual" debe ser un valor booleano.',
            'is_visible.boolean' => 'El campo "visible" debe ser un valor booleano.',
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
            ], 422)
        );
    }
}
