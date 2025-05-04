<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectConsultant extends Model
{
    
    use HasFactory,SoftDeletes;

    protected $fillable = ['user_id', 'project_id'];

    public function users(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function projects(){
        return $this->belongsTo(Project::class, 'project_id');
    }
    
  
}
