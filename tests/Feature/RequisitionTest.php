<?php

use App\Models\Equipment;
use App\Models\Requisition;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function requisitionEquipment(array $overrides = []): Equipment
{
    return Equipment::query()->create(array_merge([
        'item_code' => 'EQ-001',
        'name' => 'Projector',
        'total_qty' => 3,
        'available_qty' => 3,
        'status' => 'available',
    ], $overrides));
}

test('guests are redirected from requisitions', function () {
    $this->get(route('requisitions.index'))
        ->assertRedirect(route('login'));
});

test('users can submit requisitions and only see their own requests', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $equipment = requisitionEquipment();
    Requisition::query()->create([
        'user_id' => $otherUser->id,
        'equipment_id' => $equipment->id,
        'quantity' => 1,
        'reason' => 'Other request',
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->post(route('requisitions.store'), [
            'equipment_id' => $equipment->id,
            'quantity' => 2,
            'reason' => 'For a workshop',
        ])
        ->assertRedirect(route('requisitions.index'));

    $createdRequisition = Requisition::query()->where('user_id', $user->id)->first();

    expect($createdRequisition->status)->toBe('pending');
    expect($createdRequisition->quantity)->toBe(2);

    $this->actingAs($user)
        ->get(route('requisitions.index'))
        ->assertInertia(fn ($page) => $page
            ->where('isAdmin', false)
            ->has('requisitions', 1)
            ->where('requisitions.0.reason', 'For a workshop'));
});

test('users cannot submit requests that exceed equipment availability', function () {
    $user = User::factory()->create();
    $equipment = requisitionEquipment(['available_qty' => 2]);

    $this->actingAs($user)
        ->post(route('requisitions.store'), [
            'equipment_id' => $equipment->id,
            'quantity' => 3,
            'reason' => 'For a workshop',
        ])
        ->assertSessionHasErrors('quantity');

    expect(Requisition::query()->count())->toBe(0);
});

test('admins cannot approve a request that exceeds available equipment', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $equipment = requisitionEquipment(['available_qty' => 2]);
    $requisition = Requisition::query()->create([
        'user_id' => User::factory()->create()->id,
        'equipment_id' => $equipment->id,
        'quantity' => 3,
        'reason' => 'For a workshop',
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->patch(route('requisitions.approve', $requisition))
        ->assertSessionHasErrors('requisition');

    expect($requisition->fresh()->status)->toBe('pending');
    expect($equipment->fresh()->available_qty)->toBe(2);
});

test('only admins can approve and approval reserves equipment', function () {
    $user = User::factory()->create();
    $admin = User::factory()->create(['role' => 'admin']);
    $equipment = requisitionEquipment();
    $requisition = Requisition::query()->create([
        'user_id' => $user->id,
        'equipment_id' => $equipment->id,
        'quantity' => 2,
        'reason' => 'For a workshop',
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->patch(route('requisitions.approve', $requisition))
        ->assertForbidden();

    $this->actingAs($admin)
        ->patch(route('requisitions.approve', $requisition))
        ->assertRedirect(route('requisitions.index'));

    expect($requisition->fresh())
        ->status->toBe('approved');
    expect($equipment->fresh())
        ->available_qty->toBe(1)
        ->status->toBe('available');
});

test('admins can reject pending requisitions', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $equipment = requisitionEquipment();
    $requisition = Requisition::query()->create([
        'user_id' => User::factory()->create()->id,
        'equipment_id' => $equipment->id,
        'quantity' => 1,
        'reason' => 'For a workshop',
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->patch(route('requisitions.reject', $requisition))
        ->assertRedirect(route('requisitions.index'));

    expect($requisition->fresh()->status)->toBe('rejected');
    expect($equipment->fresh()->available_qty)->toBe(3);
});

test('admins can return approved requisitions and restore equipment', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $equipment = requisitionEquipment(['available_qty' => 1]);
    $requisition = Requisition::query()->create([
        'user_id' => User::factory()->create()->id,
        'equipment_id' => $equipment->id,
        'quantity' => 2,
        'reason' => 'For a workshop',
        'status' => 'approved',
    ]);

    $this->actingAs($admin)
        ->patch(route('requisitions.return', $requisition))
        ->assertRedirect(route('requisitions.index'));

    expect($requisition->fresh()->status)->toBe('returned');
    expect($equipment->fresh())
        ->available_qty->toBe(3)
        ->status->toBe('available');
});

test('admins cannot return pending requisitions', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $equipment = requisitionEquipment();
    $requisition = Requisition::query()->create([
        'user_id' => User::factory()->create()->id,
        'equipment_id' => $equipment->id,
        'quantity' => 1,
        'reason' => 'For a workshop',
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->patch(route('requisitions.return', $requisition))
        ->assertSessionHasErrors('requisition');

    expect($requisition->fresh()->status)->toBe('pending');
});
