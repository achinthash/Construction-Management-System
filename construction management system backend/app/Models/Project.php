<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory,SoftDeletes;


    protected $table = 'projects'; 

    protected $fillable = [
        'name',
        'type',
        'description',
        'status',
        'location',
        'progress',
        'start_date',
        'end_date',
        'budget',
    ];

    protected $casts = [
        'progress' => 'decimal:2',
        'budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function clients()
    {
        return $this->hasMany(ProjectClient::class, 'project_id');
    }

    public function consultnats()
    {
        return $this->hasMany(ProjectConsultant::class, 'project_id');
    }

    public function contractor()
    {
        return $this->hasMany(ProjectContractor::class, 'project_id');
    }

    
    

}
