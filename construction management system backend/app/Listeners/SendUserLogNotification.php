<?php

namespace App\Listeners;

use App\Events\UserLogCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\Notification;

use App\Events\NotificationSent;

class SendUserLogNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserLogCreated $event)
    {
        $userLog = $event->userLog;

    

        $notification = Notification::create([
            'type' => 'UserLog',
            'title' => 'New User Log',
            'description' => $userLog->title . 'you have work on' . $userLog->date ,
            'user_id' => $userLog->user_id,
            'is_read' => false,
            'referenced_id' => $userLog->id,
        ]);


        broadcast(new NotificationSent($notification))->toOthers();
    }
}
