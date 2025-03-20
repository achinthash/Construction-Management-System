<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'sender_id',
        'message',
        'status',
        'type'
    ];

    
    public function chat(){
        return $this->belongsTo(Chat::class, 'chat_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function latestMessage()
    {
        return $this->hasOne(Message::class, 'chat_id')->latest('created_at');
    }


    public function messageFiles()
{
    return $this->hasMany(MessageFile::class, 'message_id');
}

}
