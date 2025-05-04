<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskDate extends Model
{
    use HasFactory,SoftDeletes;


    protected $fillable = [
        'project_id',
        'task_id',
        'status',
        'date',
        'description',
        'weather_condition',
        'start_time',
        'end_time',
        'general_note'
    ];

    public function tasks(){
        return $this->belongsTo(Task::class, 'task_id');
    }
}
