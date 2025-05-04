<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BillItems extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'bill_id', 'title', 'quantity', 'unit_price', 'total'
    ];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }


}
