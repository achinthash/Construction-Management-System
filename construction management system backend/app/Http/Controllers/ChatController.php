<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Chat;
use App\Models\ChatMember;
use App\Models\Message;
use App\Models\MessageFile;

use App\Events\MessageSent;

class ChatController extends Controller
{
    //

  
    // new chat with members

    public function CreateChat(Request $request){

        $request->validate([
            'type' => ['required', 'string'],
            'name' => [ 'nullable','string'],
            'created_by' => ['required','exists:users,id'],
            'avatar' => ['nullable', 'file', 'mimes:jpg,png,jpeg,gif', 'max:10240'],

            'user_id' => ['required', 'array'],
            'user_id.*' => ['exists:users,id'],

        ]);

        $userIds = $request->user_id;
        sort($userIds); 
    
        if ($request->type === 'private') {
            // Check if a private chat with these exact users already exists
            $existingChat = Chat::where('type', 'private')
                ->whereHas('members', function ($query) use ($userIds) {
                    $query->whereIn('user_id', $userIds);
                }, '=', count($userIds))
                ->withCount('members')
                ->having('members_count', '=', count($userIds))
                ->first();

            if ($existingChat) {
                return response()->json([
                    'message' => 'Chat already exists',
                    'data' => $existingChat
                ]);
            }
        }

        $avataPath= null;

        if($request->hasFile('avatar')){
            $avataPath = $request->file('avatar')->store('groupavatar','public');
        }

        $chat = Chat::Create([
            'type' => $request->type, 
            'name' => $request->name, 
            'avatar' => $avataPath,
            'created_by' => $request->created_by, 
        ]);

        foreach($userIds as $user_id){

            ChatMember::Create([
                'chat_id' => $chat->id,
                'user_id' => $user_id, 
            ]);
        }

        return response()->json(['message' => 'Chat Created Successfully!!' , 'data' => $chat]);
    }


    // chatHead

    public function chatHead($chat_id)
    {
        $chat = Chat::where('id',$chat_id)->first();

        $users = ChatMember::where('chat_id', $chat_id)
            ->Join('users' , 'users.id' , '=' ,  'chat_members.user_id')
            ->get(['users.id', 'users.name', 'users.profile_picture']);

        $chat->users =$users;

        return $chat;
    }


    //  get private messages 

    public function privateMessages($chat_id){
        $messages =  Message::Select('messages.*', 'users.name as sender_name',
        'message_files.file_name',
        'message_files.file_path',
        'message_files.file_type',
        'message_files.file_size',
        
        )
            ->where('messages.chat_id', $chat_id)
            ->leftJoin('message_files', 'message_files.message_id' , '=' , 'messages.id')
            ->leftJoin('users', 'users.id' ,'=' ,'messages.sender_id')
            ->orderBy('messages.created_at', 'asc')
            ->get();
           
        return $messages;
    }

   

    public function privateChatList($user_id)
    {
        return Chat::where('type', 'private') 
            ->whereHas('memberschat', function ($query) use ($user_id) {
                // Ensure the user is a member of the chat
                $query->where('user_id', $user_id);
            })
            ->with([
                'memberschat.user:id,name,profile_picture',
                'messages' => function ($query) {
                    $query->latest()->with('messageFiles'); 
                }
            ])
            ->get()
            ->map(function ($chat) use ($user_id) {
                $otherMember = $chat->memberschat->where('user_id', '!=', $user_id)->first();
                $unreadCount = $chat->messages
                    ->where('sender_id', '!=', $user_id)
                    ->where('status', 'unread')
                    ->count();
    
                $lastMessage = $chat->messages->first();
                if (!$lastMessage) {
                    return null;
                }
    
                // Get the latest message file (if any)
                $latestMessageFile = $lastMessage->messageFiles->first(); 
    
                return [
                    'id' => $chat->id,
                    'type' => $chat->type,
                    'created_by' => $chat->created_by,
                    'created_at' => $chat->created_at,
    
                    'other_member' => $otherMember ? [
                        'id' => $otherMember->user->id,
                        'name' => $otherMember->user->name,
                        'profile_picture' => $otherMember->user->profile_picture,
                    ] : null,
    
                    'last_message' => [
                        'id' => $lastMessage->id,
                        'chat_id' => $lastMessage->chat_id,
                        'sender_id' => $lastMessage->sender_id,
                        'message' => $lastMessage->message,
                        'status' => $lastMessage->status,
                        'created_at' => $lastMessage->created_at,
                    ],
    
                    'latest_message_file' => $latestMessageFile ? [
                        'id' => $latestMessageFile->id,
                        'message_id' => $latestMessageFile->message_id,
                        'file_path' => $latestMessageFile->file_path ?? null, 
                        'file_name' => $latestMessageFile->file_name,
                        'created_at' => $latestMessageFile->created_at,
                    ] : null,
    
                    'unread_count' => $unreadCount
                ];
            })
            ->filter() 
            ->values();
    }
    

    /// update receiver satus 


    public function updateReceiverStatus(Request $request)
    {
        
        $request->validate([
            'chat_id' => ['required', 'exists:chats,id'],
            'receiver_id' => ['required', 'exists:users,id']
        ]);

        $updatedRows = Message::where('chat_id', $request->chat_id)
            ->where('sender_id', $request->receiver_id)
            ->where('status', 'unread')
            ->update(['status' => 'read']);

        // Check if any rows were updated
        if ($updatedRows > 0) {
            return response()->json(['message' => 'Status updated successfully']);
        } else {
            return response()->json(['message' => 'No unread messages found'], 404);
        }
    }

    
    // new message

    public function newMessage(Request $request){

        $request->validate([

            'chat_id' => ['required', 'exists:chats,id'],
            'sender_id' => ['required', 'exists:users,id'],
            'message' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            
            'file_path' => ['nullable', 'file', 'mimes:jpg,png,jpeg,gif,svg,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt', 'max:10240'],
        ]);

        $chat = Message::create([
           'chat_id' => $request->chat_id, 
           'sender_id' => $request->sender_id,
           'message' => $request->message,
           'status' => $request->status,
           'type' => $request->type
        ]);

        $fileData = null;

        if ($request->hasFile('file_path')) {
            $file = $request->file('file_path');
            $filePath = $file->store('message_files', 'public'); 
            $fileName = $file->getClientOriginalName(); 
            $fileSize = $file->getSize(); 
            $fileType = $file->getMimeType(); 

            $messageFile = MessageFile::create([
                'message_id' => $chat->id,
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_type' => $fileType,
                'file_size' => $fileSize,
            ]);

            $fileData = [
                'file_name' => $fileName,
                'file_path' => $filePath,
                'file_type' => $fileType,
                'file_size' => $fileSize,
            ]; 
        } 

        broadcast(new MessageSent($chat,$fileData))->toOthers();
        
        return response()->json(['message' => 'Message sent!', 'data' => $chat]);

    }




// group lists 


  

    public function groupLists($userId)
    {
        $chats = Chat::where('chats.type', 'group')
            ->whereHas('members', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with(['latestMessage' => function ($query) {
                $query->latest('created_at')
                    ->with('messageFiles')
                    ->select('id', 'chat_id', 'message', 'type', 'created_at');
            }])
            ->get();
    
        return $chats->map(function ($chat) {
            if ($chat->latestMessage) {
                if ($chat->latestMessage->message === null && $chat->latestMessage->messageFiles->isNotEmpty()) {
                    $chat->latestMessage->message = $chat->latestMessage->messageFiles->pluck('file_name')->first();
                }
            }
            return $chat;
        });
    }
    


}
