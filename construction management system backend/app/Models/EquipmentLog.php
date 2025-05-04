<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EquipmentLog extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'project_id',
        'task_id',
        'equipment_id',
        'title',
        'description',
        'date',
        'status',

        'start_time',
        'end_time',

    ];

    // Define relationships (if needed)
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }
}
