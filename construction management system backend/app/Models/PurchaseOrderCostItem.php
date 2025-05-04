<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrderCostItem extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'purchase_order_id',
        'item_name',
        'quantity',
        'unit',
        'unit_price',
        'total_amount',
    ];

    public function purchaseOrder() {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function estimation()
{
    return $this->hasOne(Estimation::class, 'referenced_id')
                ->where('cost_type', 'Purchase Order Cost');
}

}
