<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [ 'serial_number' , 'category', 'model', 'name', 'status', 'condition_level', 'purchase_price', 'purchase_date', 'image' ]; 

}
