<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActualCost extends Model
{
    use HasFactory,SoftDeletes;


    protected $fillable = [

        'estimation_id',
        'reason',

        'cost_type',
        'unit',
        'quantity',
        'unit_price',
        'total_cost',

    ];

    // Relationships
    public function estiomation()
    {
        return $this->belongsTo(Estimation::class);
    }

    public function actualCost()
{
    return $this->hasOne(ActualCost::class, 'estimation_id');
}

}
