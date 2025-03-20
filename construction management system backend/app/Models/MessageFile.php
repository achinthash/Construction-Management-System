<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageFile extends Model
{
    use HasFactory;


    protected $fillable = [
        'message_id',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
    ];


    public function message(){
        return $this->belongsTo(Message::class, 'message_id');
    }

    public function latestMessageFile()
    {
        return $this->hasOne(Message::class, 'message_id')->latest('created_at');
    }
}
