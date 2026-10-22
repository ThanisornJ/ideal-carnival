<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEquipmentRequest extends FormRequest
{
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
            'item_code' => ['required', 'string', 'max:255', 'unique:equipment,item_code'],
            'name' => ['required', 'string', 'max:255'],
            'total_qty' => ['required', 'integer', 'min:1'],
            'available_qty' => ['required', 'integer', 'min:0', 'lte:total_qty'],
            'status' => ['required', Rule::in(['available', 'unavailable'])],
        ];
    }
}
