<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Estimation extends Model
{
 
    use HasFactory, SoftDeletes;

  
    protected $fillable = [
        'project_id',
        'task_id',
        'title',
        'description',
        'cost_type',
        'unit',
        'quantity',
        'unit_price',
        'total_cost',
        'referenced_id'
    ];

    // Relationships
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function referenced() {
        
        return $this->morphTo();
    }


    public function actualCost()
    {
        return $this->hasOne(ActualCost::class);
    }


   

}
