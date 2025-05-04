<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectDocument extends Model
{
    use HasFactory,SoftDeletes;

    
    protected $fillable = ['doc_type', 'project_id','doc_name', 'doc_path', 'doc_referenced_id'];


    public function projects()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function referenced() 
    {
        return $this->morphTo();
    }
}
