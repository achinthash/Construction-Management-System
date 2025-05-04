<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;

class AnnouncementController extends Controller
{
    //

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:active,inactive',
            'target_type' => 'required|in:all,group,user',
            'created_by' => 'required|exists:users,id',
            'expires_at' => 'nullable|date|after_or_equal:today',
        ]);


        $announcement = Announcement::create($validated);

        return response()->json([
            'message' => 'Announcement created successfully!', ], 201);
    }


    public function selectedAnnouncement($id)
    {
        $announcement = Announcement::select('announcements.*', 'projects.name as project_name' )
            ->join('projects', 'announcements.project_id', '=', 'projects.id')
            ->where('announcements.id', $id)
            ->first();
    
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }
    
        return response()->json($announcement);
    }
    

    public function announcementAll()
    {

        $announcements = Announcement::select('announcements.*', 'projects.name as project_name')
        ->join('projects', 'announcements.project_id','=','projects.id' )
        ->orderBy('created_at', 'desc')
        ->get();
    
        return response()->json($announcements);
    }


    public function announcementsProject($projectId)
    {
        $now = now();

        $announcements = Announcement::where('project_id', $projectId)
            ->where(function ($query) use ($now) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', $now);
            })
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($announcements);
    }



    public function delete($id){

        $announcements = Announcement::findOrfail($id);

        $announcements->delete();

        return response()->json(['message' => 'Announcement deleted successfully'], 200);

    }


    public function update(Request $request,$id)
    {

        $announcement = Announcement::findOrFail($id);


        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:active,inactive',
            'target_type' => 'required|in:all,group,user',
            'created_by' => 'required|exists:users,id',
            'expires_at' => 'nullable|date',
        ]);


        $announcement->update($validated);

        return response()->json(['message' => 'Announcement updated successfully!', ], 201);
    }


}
