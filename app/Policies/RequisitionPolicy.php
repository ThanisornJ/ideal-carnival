<?php

namespace App\Policies;

use App\Models\Requisition;
use App\Models\User;

class RequisitionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Requisition $requisition): bool
    {
        return $user->role === 'admin' || $user->id === $requisition->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function approve(User $user, Requisition $requisition): bool
    {
        return $user->role === 'admin';
    }

    public function reject(User $user, Requisition $requisition): bool
    {
        return $user->role === 'admin';
    }

    public function return(User $user, Requisition $requisition): bool
    {
        return $user->role === 'admin';
    }
}
