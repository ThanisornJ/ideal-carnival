<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $fillable = [
        'item_code',
        'name',
        'total_qty',
        'available_qty',
        'status',
    ];

    public function requisitions()
    {
        return $this->hasMany(Requisition::class);
    }
}
