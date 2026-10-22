<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Requisition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        return Inertia::render('home', [
            'isAdmin' => $isAdmin,
            'stats' => [
                'equipmentCount' => Equipment::query()->count(),
                'availableQuantity' => Equipment::query()->sum('available_qty'),
                'pendingRequisitions' => Requisition::query()
                    ->when(! $isAdmin, fn ($query) => $query->whereBelongsTo($user))
                    ->where('status', 'pending')
                    ->count(),
                'requisitionCount' => Requisition::query()
                    ->when(! $isAdmin, fn ($query) => $query->whereBelongsTo($user))
                    ->count(),
            ],
            'recentRequisitions' => Requisition::query()
                ->with([
                    'equipment:id,item_code,name',
                    'user:id,name',
                ])
                ->when(! $isAdmin, fn ($query) => $query->whereBelongsTo($user))
                ->latest()
                ->limit(5)
                ->get(['id', 'user_id', 'equipment_id', 'quantity', 'status', 'reason']),
        ]);
    }
}
