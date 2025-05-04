<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QualityControl extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'project_id',
        'task_id',
        'title',
        'description',
        'checked_by',
        'checked_date',
        'expected_check_date',
        'status',
        'comment',
        'action_required',
        'resolution_date',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function checkedBy()
    {
        return $this->belongsTo(User::class, 'checked_by');
    }


}
