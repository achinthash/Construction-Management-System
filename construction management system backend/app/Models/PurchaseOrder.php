<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrder extends Model
{
    use HasFactory,SoftDeletes;


    protected $fillable = [
        'project_id',
        'task_id',
        'title',
        'status',
        'delivery_date',
        'created_by',
        'supplier_name',
        'supplier_phone',
    ];



    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function task() {
        return $this->belongsTo(Task::class);
    }

    public function creator() {
        return $this->belongsTo(User::class, 'created_by');
    }


    public function PurchaseOrderCostItem()
    {
        return $this->hasMany(PurchaseOrderCostItem::class, 'purchase_order_id');
    }


    
    public function costItems()
    {
        return $this->hasMany(PurchaseOrderCostItem::class, 'purchase_order_id');
    }
}
