<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class MaterialLog extends Model
{
    use HasFactory,SoftDeletes; 

    protected $fillable = [
        'project_id',
        'task_id',

        'title',
        'description',
        'date',
        'status',
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

  
}
