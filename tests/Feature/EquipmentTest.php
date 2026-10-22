<?php

use App\Models\Equipment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected from the equipment page', function () {
    $response = $this->get(route('equipment.index'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can view equipment inventory', function () {
    $user = User::factory()->create(['role' => 'user']);
    Equipment::query()->create([
        'item_code' => 'EQ-001',
        'name' => 'Projector',
        'total_qty' => 3,
        'available_qty' => 2,
        'status' => 'available',
    ]);

    $response = $this->actingAs($user)->get(route('equipment.index'));

    $response->assertOk();
    $response->assertInertia(
        fn ($page) => $page
            ->component('equipment')
            ->has('equipment', 1)
            ->where('equipment.0.item_code', 'EQ-001')
            ->where('equipment.0.name', 'Projector'),
    );
});

test('only admins can add equipment', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)->post(route('equipment.store'), [
        'item_code' => 'EQ-002',
        'name' => 'Microphone',
        'total_qty' => 5,
        'available_qty' => 5,
        'status' => 'available',
    ]);

    $response->assertForbidden();
    expect(Equipment::query()->where('item_code', 'EQ-002')->exists())->toBeFalse();
});

test('admins can add equipment', function () {
    $user = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($user)->post(route('equipment.store'), [
        'item_code' => 'EQ-002',
        'name' => 'Microphone',
        'total_qty' => 5,
        'available_qty' => 4,
        'status' => 'available',
    ]);

    $response->assertRedirect(route('equipment.index'));
    $this->assertDatabaseHas('equipment', [
        'item_code' => 'EQ-002',
        'name' => 'Microphone',
        'available_qty' => 4,
    ]);
});

test('equipment creation validates quantities and unique item codes', function () {
    $user = User::factory()->create(['role' => 'admin']);
    Equipment::query()->create([
        'item_code' => 'EQ-003',
        'name' => 'Projector',
        'total_qty' => 1,
        'available_qty' => 1,
        'status' => 'available',
    ]);

    $response = $this->actingAs($user)->post(route('equipment.store'), [
        'item_code' => 'EQ-003',
        'name' => 'Another projector',
        'total_qty' => 2,
        'available_qty' => 3,
        'status' => 'available',
    ]);

    $response->assertSessionHasErrors(['item_code', 'available_qty']);
});

test('only admins can update equipment', function () {
    $user = User::factory()->create(['role' => 'user']);
    $equipment = Equipment::query()->create([
        'item_code' => 'EQ-004',
        'name' => 'Speaker',
        'total_qty' => 2,
        'available_qty' => 1,
        'status' => 'available',
    ]);

    $this->actingAs($user)
        ->patch(route('equipment.update', $equipment), [
            'total_qty' => 5,
            'available_qty' => 5,
            'status' => 'available',
        ])
        ->assertForbidden();
});

test('admins can update equipment stock and status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $equipment = Equipment::query()->create([
        'item_code' => 'EQ-004',
        'name' => 'Speaker',
        'total_qty' => 2,
        'available_qty' => 1,
        'status' => 'available',
    ]);

    $this->actingAs($admin)
        ->patch(route('equipment.update', $equipment), [
            'total_qty' => 5,
            'available_qty' => 4,
            'status' => 'unavailable',
        ])
        ->assertRedirect(route('equipment.index'));

    expect($equipment->fresh())
        ->total_qty->toBe(5)
        ->available_qty->toBe(4)
        ->status->toBe('unavailable');
});

test('equipment updates cannot exceed total stock', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $equipment = Equipment::query()->create([
        'item_code' => 'EQ-004',
        'name' => 'Speaker',
        'total_qty' => 2,
        'available_qty' => 1,
        'status' => 'available',
    ]);

    $this->actingAs($admin)
        ->patch(route('equipment.update', $equipment), [
            'total_qty' => 3,
            'available_qty' => 4,
            'status' => 'available',
        ])
        ->assertSessionHasErrors('available_qty');
});
