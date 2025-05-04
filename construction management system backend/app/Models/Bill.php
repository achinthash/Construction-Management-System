<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bill extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'title',
        'project_id',
        'bill_type',
        'status',
        'tax',
        'discount',
        'subtotal',
        'paid_by',
        'paid_to',
        'notes',
        'total'
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function payer()
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    public function payee()
    {
        return $this->belongsTo(User::class, 'paid_to');
    }
    public function items()
    {
        return $this->hasMany(BillItems::class, 'bill_id');
    }
}
