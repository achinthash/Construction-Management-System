<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use App\Models\Chat;
use App\Models\ChatMember;
use App\Models\Message;
use App\Models\MessageFile;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $fileData;


    /**
     * Create a new event instance.
     */
    public function __construct(Message $message ,  $fileData = null)
    {
        $this->message = $message;
        $this->fileData = $fileData; // Set the file data
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel('chat.' . $this->message->chat_id);
    }


    public function broadcastWith()
{
    // Get chat type
    $chat = Chat::find($this->message->chat_id);

    // Initialize message data
    $messageData = $this->message->toArray();

    // If chat is a group, fetch sender's name; otherwise, do not include it
    if ($chat && $chat->type === 'group') {
        $messageData['sender_name'] = User::where('id', $this->message->sender_id)->value('name') ?? 'Unknown User';
    }

    return [
        'message' => $messageData,
        'file' => $this->fileData, 
    ];
}

}
