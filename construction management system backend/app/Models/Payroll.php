<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payroll extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = [
        'project_id',
        'user_id',
        'wagetype',
        'wage_rate',
        'worked_date',
        'worked_hours',
        'total_earned',
        'status',
    ];

    // Define the relationship with the Project and User models
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
