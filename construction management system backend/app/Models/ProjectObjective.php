<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class ProjectObjective extends Model
{

    use HasFactory,SoftDeletes;

    protected $fillable = ['objective', 'project_id'];


    public function projects(){
        return $this->belongsTo(Project::class, 'project_id');
    }

}
