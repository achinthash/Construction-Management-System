<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyLogIssues extends Model
{
    use HasFactory,SoftDeletes;


    protected $fillable = [
        'task_date_id',
        'task_id',
        'project_id',
        'issue',
        'impact',
        'action_taken',
    ];


    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    public function taskDate()
    {
        return $this->belongsTo(TaskDate::class);
    }
}
