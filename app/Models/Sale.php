<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'total', 'cash_tendered', 'change_amount', 'status', 'notes'])]
class Sale extends Model
{
    protected $casts = [
        'total' => 'decimal:2',
        'cash_tendered' => 'decimal:2',
        'change_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }
}
