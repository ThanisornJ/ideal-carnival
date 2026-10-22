<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('only admins can access user management', function () {
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertForbidden();
});

test('admins can view users', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->get(route('users.index'))
        ->assertInertia(fn ($page) => $page
            ->component('users')
            ->where('currentUserId', $admin->id)
            ->has('users', 2),
        );
});

test('admins can update a user role and profile', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->patch(route('users.update', $user), [
            'name' => 'Updated User',
            'email' => 'updated@example.com',
            'role' => 'admin',
        ])
        ->assertRedirect(route('users.index'));

    expect($user->fresh())
        ->name->toBe('Updated User')
        ->email->toBe('updated@example.com')
        ->role->toBe('admin');
});

test('user updates validate the role and email', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->patch(route('users.update', $user), [
            'name' => '',
            'email' => 'not-an-email',
            'role' => 'manager',
        ])
        ->assertSessionHasErrors(['name', 'email', 'role']);
});
