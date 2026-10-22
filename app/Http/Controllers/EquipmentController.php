<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;
use App\Models\Equipment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EquipmentController extends Controller
{
    /**
     * Display the equipment inventory.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('equipment', [
            'isAdmin' => $request->user()->role === 'admin',
            'equipment' => Equipment::query()
                ->orderBy('name')
                ->get([
                    'id',
                    'item_code',
                    'name',
                    'total_qty',
                    'available_qty',
                    'status',
                ]),
        ]);
    }

    /**
     * Store a newly created equipment item.
     */
    public function store(StoreEquipmentRequest $request): RedirectResponse
    {
        Gate::authorize('create', Equipment::class);

        Equipment::query()->create($request->validated());

        return to_route('equipment.index');
    }

    public function update(UpdateEquipmentRequest $request, Equipment $equipment): RedirectResponse
    {
        Gate::authorize('update', $equipment);

        $equipment->update($request->validated());

        return to_route('equipment.index');
    }
}
