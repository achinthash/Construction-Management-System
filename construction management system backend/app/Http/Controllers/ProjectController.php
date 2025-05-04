<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectClient;
use App\Models\ProjectContractor;
use App\Models\ProjectConsultant;
use App\Models\ProjectObjective;

use App\Models\ProjectDocument;
use App\Models\ProjectImage;

use App\Models\User;



class ProjectController extends Controller
{
    // store project  -> finished
    // edit project 
    // shows selected projects
    // list all projects -> for admin
    // list project that -> stakeholders , contractors, and consultants if there a member of that specific project
    // edit project stakeholders , contractors, and consultants (optional)


    // update status
    // update progress
    // notify project status update as above 3 users as notifications and emails

    // delete project 
    // dlete project stakeholders , contractors, and consultants 

    // list project team with stakeholders , contractors, and consultants  and labors
    // list project equipments 



    public function store(Request $request){

        $validated =  $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'type' => ['required', 'string', 'max:25'],
            'description' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:25'],
            'location' => ['required', 'string', 'max:255'],
            'progress' => ['required', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['nullable', 'date', ],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['required', 'numeric', 'min:0'],


            'client_id' => ['nullable' , 'array'],
            'client_id.*' => ['exists:users,id'],

            'contractor_id' => ['nullable' , 'array'],
            'contractor_id.*' => ['exists:users,id'],

            'consultant_id' => ['nullable' , 'array'],
            'consultant_id.*' => ['exists:users,id'],

            'objective' => ['nullable' , 'array'],
            'objective.*' => ['nullable', 'string', 'max:255'],


            // project images 

            'img_type' => ['nullable', 'string', 'max:25'],
            'image_path' => ['nullable', 'array'],
            'image_path.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
           

            // project documents 

            'doc_type' => ['nullable', 'string', 'max:25'],
            'doc_path' => ['nullable', 'array'], 
            'doc_path.*' => ['nullable', 'file', 'mimes:pdf,doc,docx,xlsx,xls,csv,txt', 'max:5120'], 
           

        ]);


        $project = Project::create($validated);


        // project clients add 

        if(!empty($request->client_id)){
            foreach($request->client_id as $client_id){
                ProjectClient::create([
                    'user_id' => $client_id,
                    'project_id' => $project->id
                ]);
            }
        }


         // project contractor add 

         if(!empty($request->contractor_id)){
            foreach($request->contractor_id as $contractor_id){
                ProjectContractor::create([
                    'user_id' => $contractor_id,
                    'project_id' => $project->id
                ]);
            }
        }
        

         // project consultant add 

         if(!empty($request->consultant_id)){
            foreach($request->consultant_id as $consultant_id){
                ProjectConsultant::create([
                    'user_id' => $consultant_id,
                    'project_id' => $project->id
                ]);
            }
        }

        // project objective add 

        if(!empty($request->objective)){
            foreach($request->objective as $objective){
                ProjectObjective::create([
                    'objective' => $objective,
                    'project_id' => $project->id
                ]);
            }
        }


      
        // project images add 

        if(!empty($request->image_path)){

            foreach ($request->file('image_path') as $key => $image) {
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->store('project_pictures', 'public');

                ProjectImage::create([
                    'img_type' => $request->img_type,
                    'image_name' => $imageName,
                    'image_path' => $imagePath,
                    'project_id' => $project->id,
                    'img_referenced_id' => $project->id,
                ]);
            }

        }

         
        // project files add 

        if(!empty($request->doc_path)){

            foreach ($request->file('doc_path') as $key => $document) {
                $docName = time() . '_' . $document->getClientOriginalName();
                $docPath = $document->store('project_documents', 'public');
                
                ProjectDocument::create([
                    'doc_type' => $request->doc_type,
                    'doc_name' => $docName,
                    'doc_path' => $docPath,
                    'project_id' => $project->id,
                    'doc_referenced_id' =>  $project->id,
                ]);
            }

        }

        return response()->json(['message' => 'project create successfully', 'project' => $project], 200);

    }


    // new project user for exiating project 


    public function newUserProject(Request $request)
    {
        $validated = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
    
            'client_id' => ['nullable', 'array'],
            'client_id.*' => ['exists:users,id'],
    
            'contractor_id' => ['nullable', 'array'],
            'contractor_id.*' => ['exists:users,id'],
    
            'consultant_id' => ['nullable', 'array'],
            'consultant_id.*' => ['exists:users,id'],
        ]);
    
        // Load project ID from validated data
        $projectId = $validated['project_id'];
    
        // Add project clients
        if (!empty($validated['client_id'])) {
            foreach ($validated['client_id'] as $client_id) {
                ProjectClient::create([
                    'user_id' => $client_id,
                    'project_id' => $projectId
                ]);
            }
        }
    
        // Add project contractors
        if (!empty($validated['contractor_id'])) {
            foreach ($validated['contractor_id'] as $contractor_id) {
                ProjectContractor::create([
                    'user_id' => $contractor_id,
                    'project_id' => $projectId
                ]);
            }
        }
    
        // Add project consultants
        if (!empty($validated['consultant_id'])) {
            foreach ($validated['consultant_id'] as $consultant_id) {
                ProjectConsultant::create([
                    'user_id' => $consultant_id,
                    'project_id' => $projectId
                ]);
            }
        }
    
        return response()->json(['message' => 'Project users added successfully'], 200);
    }
    

    // list all projects 


    public function ListProjects(){
        $projects = Project::all();

        return response()->json($projects,200);
    }



    // projects based users  to showing projects for users if labor he cant see projects

    public function projects($user_id){

        $user = User::findOrFail($user_id);

        if($user->role === 'admin'){

            return Project::all();

            //   return Project::orderBy('id', 'desc')->get(); 
        }
        else if($user->role === 'contractor'){

            $contractorProjects = ProjectContractor::where('project_contractors.user_id', $user_id)->get();
            $contractorProjectsall = $contractorProjects->pluck('project_id'); 
           
            return Project::whereIn('id', $contractorProjectsall)->orderBy('id', 'asc')->get();
        }
        else if($user->role === 'consultant'){

            $consultantProjects =  ProjectConsultant::where('project_consultants.user_id', $user_id)->get();
            $consultantProjectsall = $consultantProjects->pluck('project_id');

            return Project::whereIn('id', $consultantProjectsall)->orderBy('id', 'asc')->get();
        }
        else if($user->role === 'client'){

            $clientsProject = ProjectClient::where('project_clients.user_id',$user_id)->get();
            $clientsProjectsall = $clientsProject->pluck('project_id');
           
            return Project::whereIn('id', $clientsProjectsall)->orderBy('id', 'asc')->get();
        }
        else{
            return response()->json(['message' => 'Unauthorized role'], 403);
        }


    }


    public function accessProject($user_id, $project_id)
    {
        $user = User::findOrFail($user_id);

        $hasAccess = false;

        if ($user->role === 'admin') {
            $hasAccess = true;
        } elseif ($user->role === 'contractor') {
            $hasAccess = ProjectContractor::where('user_id', $user_id)->where('project_id', $project_id)->exists();
        } elseif ($user->role === 'consultant') {
            $hasAccess = ProjectConsultant::where('user_id', $user_id)->where('project_id', $project_id)->exists();
        } elseif ($user->role === 'client') {
            $hasAccess = ProjectClient::where('user_id', $user_id)->where('project_id', $project_id)->exists();
        }

        if (!$hasAccess) {
            return response()->json(['message' => 'Unauthorized access to this project.'], 403);
        }

        return Project::findOrFail($project_id);
    }



    public function deleteProject($id){

        $project = Project::findOrfail($id);

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);

    }


    public function selectedProject($id){

        $project = Project::findOrfail($id);

        return response()->json($project);

    }


    public function ProjectUsers($project_id)
    {
        $project = Project::with([
            'clients.users',  // Load client users
            'consultnats.users', // Load consultant users
            'contractor.users' // Load contractor users
        ])->where('id', $project_id)->first();

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }


        $users = collect();

        if ($project->clients) {
            $users = $users->merge($project->clients->map(fn($client) => $client->users));
        }
        if ($project->consultnats) {
            $users = $users->merge($project->consultnats->map(fn($consultant) => $consultant->users));
        }
        if ($project->contractor) {
            $users = $users->merge($project->contractor->map(fn($contractor) => $contractor->users));
        }
    
        // Remove duplicate users
        $uniqueUsers = $users->unique('id')->values();

       

        return response()->json($uniqueUsers);
    }



    public function update(Request $request, $id){

        $project = Project::findOrFail($id);

        $validated =  $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'type' => ['required', 'string', 'max:25'],
            'description' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:25'],
            'location' => ['required', 'string', 'max:255'],
            'progress' => ['required', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['nullable', 'date', ],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['required', 'numeric', 'min:0'],           

        ]);

        $project->update($validated);

        return response()->json(['message' => 'Project updated successfully', 'user' => $project], 200);


    }



}



