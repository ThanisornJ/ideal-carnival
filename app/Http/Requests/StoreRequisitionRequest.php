<?php

namespace App\Http\Requests;

use App\Models\Equipment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreRequisitionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'equipment_id' => ['required', 'integer', 'exists:equipment,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['required', 'string', 'max:1000'],
        ];
    }

    /**
     * Validate the request against the equipment's current availability.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->hasAny(['equipment_id', 'quantity'])) {
                    return;
                }

                $equipment = Equipment::query()->find($this->integer('equipment_id'));

                if ($equipment !== null && $this->integer('quantity') > $equipment->available_qty) {
                    $validator->errors()->add(
                        'quantity',
                        "Only {$equipment->available_qty} units are currently available.",
                    );
                }
            },
        ];
    }

}
