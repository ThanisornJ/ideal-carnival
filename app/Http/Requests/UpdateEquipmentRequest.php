<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentRequest extends FormRequest
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
     * @return array<string, array<int, mixed>|string>
     */
    public function rules(): array
    {
        return [
            'total_qty' => ['required', 'integer', 'min:1'],
            'available_qty' => ['required', 'integer', 'min:0', 'lte:total_qty'],
            'status' => ['required', Rule::in(['available', 'unavailable'])],
        ];
    }
}
