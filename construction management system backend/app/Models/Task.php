<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['project_id', 'name' , 'status','start_date','end_date','progress', 'description', 'priority' ];


    public function projects(){
        return $this->belongsTo(Project::class, 'project_id');
    }


    public function dates()
    {
        return $this->hasMany(TaskDate::class, 'task_id');
    }




}
