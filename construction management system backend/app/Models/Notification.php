<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;


    protected $fillable = ['user_id', 'title', 'description', 'is_read', 'type', 'referenced_id' ];

    public function referenced() {
        
        return $this->morphTo();
    }
}
