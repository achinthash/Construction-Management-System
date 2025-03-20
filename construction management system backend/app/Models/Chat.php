<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'avatar',
        'created_by',
    ];


    public function members()
    {
        return $this->belongsToMany(User::class, 'chat_members', 'chat_id', 'user_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'chat_id');
    }


    public function memberschat()
    {
        return $this->hasMany(ChatMember::class, 'chat_id');
    }


    public function lastMessage()
    {
        return $this->hasOne(Message::class, 'chat_id')->latest();
    }
    public function latestMessage()
    {
        return $this->hasOne(Message::class, 'chat_id')->latest('created_at');
    }
}
