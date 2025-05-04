<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification; 

use App\Events\NotificationSent;

class NotificationController extends Controller
{
    //

    public function store(Request $request)
    {
        $validated =  $request->validate([
            'type' => ['required', 'string', 'max:25'],
            'title' => ['required', 'string', 'max:25'],
            'description' => ['nullable', 'string', 'max:255'],
            'user_id' => ['required', 'array'],
            'user_id.*' => ['exists:users,id'],
            'is_read' => 'required|boolean',
            'referenced_id' => ['nullable'],
        ]);

        $notifications = [];

        foreach ($validated['user_id'] as $user_id) {
            $notification = Notification::create([
                'type' => $validated['type'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'user_id' => $user_id,
                'is_read' => $validated['is_read'],
                'referenced_id' => $validated['referenced_id'],
            ]);

            broadcast(new NotificationSent($notification))->toOthers();
            $notifications[] = $notification;
        }

        return response()->json(["Notification" => $notifications], 201);
    }



    public function statusUpdate(Request $request, $id){

        $notification = Notification::findOrFail($id);

        $validated = $request->validate([
            'is_read' => ['required', 'boolean']
        ]);
    
        $notification->update($validated);
    
        return response()->json(['notification' => $notification, 'message' => 'Notification updated successfully']);

    }


    public function notificationsLists($user_id){

        $notifications = Notification::Select('notifications.*')
            ->where('notifications.user_id',$user_id)
            ->orderBy('notifications.created_at', 'desc')
            ->get();

        return $notifications;
    }
}
