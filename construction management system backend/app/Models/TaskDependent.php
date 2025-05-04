<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskDependent extends Model
{
    use HasFactory,SoftDeletes;

  //  protected $table = 'task_dependencies';

    protected $fillable = [
        'task_id',
        'dependent_task_id',
    ];
    
  /**
     * Get the task that depends on another task.
     */
    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    /**
     * Get the task that is being depended upon.
     */
    public function dependentTask()
    {
        return $this->belongsTo(Task::class, 'dependent_task_id');
    }
}
