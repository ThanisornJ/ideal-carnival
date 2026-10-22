<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequisitionRequest;
use App\Models\Equipment;
use App\Models\Requisition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RequisitionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        return Inertia::render('requisition', [
            'isAdmin' => $isAdmin,
            'equipment' => Equipment::query()
                ->where('available_qty', '>', 0)
                ->orderBy('name')
                ->get(['id', 'item_code', 'name', 'available_qty']),
            'requisitions' => Requisition::query()
                ->with([
                    'equipment:id,item_code,name,available_qty',
                    'user:id,name,email',
                ])
                ->when(! $isAdmin, fn ($query) => $query->whereBelongsTo($user))
                ->latest()
                ->get(),
        ]);
    }

    public function store(StoreRequisitionRequest $request): RedirectResponse
    {
        Gate::authorize('create', Requisition::class);

        $request->user()->requisitions()->create($request->validated() + [
            'status' => 'pending',
        ]);

        return to_route('requisitions.index');
    }

    public function approve(Requisition $requisition): RedirectResponse
    {
        Gate::authorize('approve', $requisition);

        DB::transaction(function () use ($requisition): void {
            $lockedRequisition = Requisition::query()
                ->lockForUpdate()
                ->findOrFail($requisition->id);

            if ($lockedRequisition->status !== 'pending') {
                throw ValidationException::withMessages([
                    'requisition' => 'Only pending requisitions can be approved.',
                ]);
            }

            $equipment = Equipment::query()
                ->lockForUpdate()
                ->findOrFail($lockedRequisition->equipment_id);

            if ($equipment->available_qty < $lockedRequisition->quantity) {
                throw ValidationException::withMessages([
                    'requisition' => 'There is not enough available equipment for this requisition.',
                ]);
            }

            $remainingQuantity = $equipment->available_qty - $lockedRequisition->quantity;
            $equipment->update([
                'available_qty' => $remainingQuantity,
                'status' => $remainingQuantity === 0 ? 'unavailable' : 'available',
            ]);
            $lockedRequisition->update(['status' => 'approved']);
        });

        return to_route('requisitions.index');
    }

    public function reject(Requisition $requisition): RedirectResponse
    {
        Gate::authorize('reject', $requisition);

        if ($requisition->status !== 'pending') {
            throw ValidationException::withMessages([
                'requisition' => 'Only pending requisitions can be rejected.',
            ]);
        }

        $requisition->update(['status' => 'rejected']);

        return to_route('requisitions.index');
    }

    public function return(Requisition $requisition): RedirectResponse
    {
        Gate::authorize('return', $requisition);

        DB::transaction(function () use ($requisition): void {
            $lockedRequisition = Requisition::query()
                ->lockForUpdate()
                ->findOrFail($requisition->id);

            if ($lockedRequisition->status !== 'approved') {
                throw ValidationException::withMessages([
                    'requisition' => 'Only approved requisitions can be returned.',
                ]);
            }

            $equipment = Equipment::query()
                ->lockForUpdate()
                ->findOrFail($lockedRequisition->equipment_id);

            $availableQuantity = $equipment->available_qty + $lockedRequisition->quantity;

            $equipment->update([
                'available_qty' => min($availableQuantity, $equipment->total_qty),
                'status' => 'available',
            ]);
            $lockedRequisition->update(['status' => 'returned']);
        });

        return to_route('requisitions.index');
    }
}
