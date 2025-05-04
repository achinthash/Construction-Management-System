<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectImage extends Model
{
    use HasFactory,SoftDeletes;

    
    protected $fillable = ['img_type', 'project_id','image_name', 'image_path', 'img_referenced_id'];


    public function projects()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function referenced() 
    {
        return $this->morphTo();
    }
}
