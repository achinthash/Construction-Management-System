<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'title',
        'message',
        'project_id',
        'priority',
        'status',
        'target_type',
        'created_by',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];


    public function project()
    {
        return $this->belongsTo(Project::class);
    }


 
}
