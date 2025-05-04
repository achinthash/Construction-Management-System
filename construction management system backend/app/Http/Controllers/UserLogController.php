<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserLog;
use App\Models\Estimation;
use App\Models\User;

use App\Events\UserLogCreated;



class UserLogController extends Controller
{
    //

    // create user log with dates
    // check user is availbale for specific date


    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string', 
            
            'date' => 'required|date',
            'status' => 'required|string|max:255',

            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after_or_equal:start_time',
            'work_quality' => 'nullable|string',
       
            'wagetype' => 'nullable|string',
            'wage_rate' => 'nullable|numeric',
            'workHours' => 'nullable|numeric',
            'total_cost' => 'nullable|numeric',

        ]);


        $userLog = UserLog::create([
            'task_id' => $request->task_id,
            'project_id' => $request->project_id,
            'user_id' => $request->user_id,
            'title' => $request->title,
            'description' => $request->description,
            
            'date' => $request->date,
            'status' => $request->status,

            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'work_quality' => $request->work_quality,
        ]);

             // for user name retun 
        // user name return for if need estimations 
        $user = User::findOrFail($request->user_id);
        $user_name = $user->name;

        if($request->total_cost){

            Estimation::create([
                'project_id' =>  $userLog->project_id,
                'task_id' =>  $userLog->task_id,
                
                'title' => $user_name.'- labor cost',
                'cost_type' => 'Labor Cost',
                'unit' => $request->wagetype,
                'quantity' => $request->workHours,
                'unit_price' => $request->wage_rate,
                'total_cost' => $request->total_cost,
    
                'referenced_id' => $userLog->id, 
            ]);
        }

        event(new UserLogCreated($userLog));



        return response()->json(['message' => 'User Log created successfully'], 201);
    }



    public function userLogDates(){

        $users = User::with('userLogs')->get();

        return response()->json($users);

    }


    public function userLogDatesUser($user_id){
        $users = User::with('userLogs')->find($user_id);

        return response()->json($users);

    }

    // users logs by tasks

    public function userLogsForByTask($task_id)
{
    $logs = UserLog::select(
            'user_logs.*', 
            'users.name as user_name', 
            'users.role as user_role', 
            'users.position as user_position', 
            'users.status as user_status', 
            'users.profile_picture as user_profile_picture'
        )
        ->where('user_logs.task_id', $task_id)
        ->join('users', 'user_logs.user_id', '=', 'users.id')
        ->get()
        ->groupBy('user_id'); 

    // Restructure response
    $formattedLogs = $logs->map(function ($userLogs, $userId) {
       
        // $totalCost = $userLogs->sum(function ($log) {
        //     return (float) $log->total_cost ?: 0; // Sum total_cost values
        // });

        $logCount = $userLogs->count();
        
        // Calculate progress percentage
        $finishedLogsCount = $userLogs->where('status', 'finished')->count(); // Count logs with status "finished"
        $progressPercentage = $logCount > 0 ? round(($finishedLogsCount / $logCount) * 100, 2) : 0;

        return [
            'user_id' => $userId,
            'user_name' => $userLogs->first()->user_name,
            'user_role' => $userLogs->first()->user_role,
            'user_position' => $userLogs->first()->user_position,
            'user_status' => $userLogs->first()->user_status,
            'user_profile_picture' => $userLogs->first()->user_profile_picture,
          
            'progress_percentage' => $progressPercentage, 
            'allocated_dates' => $userLogs->count(),
            'log' => $userLogs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'task_id' => $log->task_id,
                    'title' => $log->title,
                    'description' => $log->description,
                    'date' => $log->date,
                    'status' => $log->status,
                    'start_time' => $log->start_time,
                    'end_time' => $log->end_time,
                    'work_quality' => $log->work_quality,
                ];
            })->values()
        ];
    })->values();

    return response()->json($formattedLogs);
}


    // users logg by projects

    public function userLogsForByProjects($project_id)
    {
        $logs = UserLog::select(
                'user_logs.*', 
                'users.name as user_name', 
                'users.role as user_role', 
                'users.position as user_position', 
                'users.status as user_status', 
                'users.profile_picture as user_profile_picture'
            )
            ->where('user_logs.project_id', $project_id)
            ->join('users', 'user_logs.user_id', '=', 'users.id')
            ->get()
            ->groupBy('user_id'); 

        // Restructure response
        $formattedLogs = $logs->map(function ($userLogs, $userId) {
        
            // $totalCost = $userLogs->sum(function ($log) {
            //     return (float) $log->total_cost ?: 0; // Sum total_cost values
            // });

            $logCount = $userLogs->count();
            
            // Calculate progress percentage
            $finishedLogsCount = $userLogs->where('status', 'finished')->count(); // Count logs with status "finished"
            $progressPercentage = $logCount > 0 ? round(($finishedLogsCount / $logCount) * 100, 2) : 0;

            return [
                'user_id' => $userId,
                'user_name' => $userLogs->first()->user_name,
                'user_role' => $userLogs->first()->user_role,
                'user_position' => $userLogs->first()->user_position,
                'user_status' => $userLogs->first()->user_status,
                'user_profile_picture' => $userLogs->first()->user_profile_picture,
            
                'progress_percentage' => $progressPercentage, 
                'allocated_dates' => $userLogs->count(),
                'log' => $userLogs->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'task_id' => $log->task_id,
                        'title' => $log->title,
                        'description' => $log->description,
                        'date' => $log->date,
                        'status' => $log->status,
                        'start_time' => $log->start_time,
                        'end_time' => $log->end_time,
                        'work_quality' => $log->work_quality,
                    ];
                })->values()
            ];
        })->values();

        return response()->json($formattedLogs);
    }   



    public function myTasksGrouped($user_id)
    {
        $myTasks = UserLog::select('user_logs.*', 'tasks.name as task_name', 'projects.name as project_name')
            ->where('user_logs.user_id', $user_id)
            ->join('tasks', 'tasks.id', '=', 'user_logs.task_id')
            ->join('projects', 'projects.id', '=', 'user_logs.project_id')
            ->get()
            ->groupBy('project_id');
    
        $structuredTasks = [];
    
        foreach ($myTasks as $projectId => $tasks) {
            $projectName = $tasks->first()->project_name;
            
            $groupedTasks = $tasks->groupBy('task_id')->map(function ($taskGroup) {
                return [
                    'task_name' => $taskGroup->first()->task_name,
                    'tasks' => $taskGroup->values()
                ];
            })->values();
    
            $structuredTasks[] = [
                'project_id' => $projectId,
                'project_name' => $projectName,
                'tasks' => $groupedTasks
            ];
        }
    
        return response()->json($structuredTasks);
    }



    public function myTasks($user_id){

        $myTasks = UserLog::select('user_logs.*', 'tasks.name as task_name', 'projects.name as project_name')
            ->where('user_logs.user_id', $user_id)
            ->join('tasks', 'tasks.id', '=', 'user_logs.task_id')
            ->join('projects', 'projects.id', '=', 'user_logs.project_id')
            ->get();

        return response()->json($myTasks);
    }



    // user log by date

    public function userLogByDate($task_id, $date)
    {
        $log = UserLog::select(
                    'user_logs.*', 
                    'users.name as user_name','users.role as user_role' , 'users.position as user_position' ,'users.profile_picture as user_profile_picture',
                    'estimations.unit','estimations.unit_price','estimations.quantity',   'estimations.total_cost',  'estimations.id as estimations_id',
                    'actual_costs.id as actual_cost_id',  'actual_costs.unit as actual_cost_unit','actual_costs.unit_price as actual_cost_unit_price','actual_costs.quantity as actual_cost_quantity',  'actual_costs.total_cost as actual_cost_total_cost'
                )
                ->where('user_logs.task_id', $task_id)
                ->where('user_logs.date', $date)
                ->join('users', 'users.id', '=', 'user_logs.user_id')
                ->leftJoin('estimations', function($join) {
                    $join->on('user_logs.id', '=', 'estimations.referenced_id')
                         ->where('estimations.cost_type', 'Labor Cost');
                })
                ->leftJoin('actual_costs', function($join) {
                    $join->on('estimations.id', '=', 'actual_costs.estimation_id');
                })
                ->orderBy('user_logs.id')
                ->get();
    
        return response()->json($log);
    }
    
    

    public function update(Request $request, $id)
    {
       
        $userLog = UserLog::findOrFail($id);
    
 
        $validated = $request->validate([

            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string', 
            
            'date' => 'nullable|date',
            'status' => 'required|string|max:255',

            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after_or_equal:start_time',
            'work_quality' => 'nullable|string',
        ]);
    

        $userLog->update($validated);
    
    
        return response()->json([
            'succrss' => true,
            'message' => 'User log updated successfully'
        ]);
    }


    public function userLogSelected($id)
    {
        $userLog = UserLog::findOrFail($id);
    
        return response()->json( $userLog);
    }
    

    public function delete($id)
    {
        $userLog = UserLog::findOrFail($id);
        $userLog->delete();

        return response()->json(['message' => 'User Log deleted successfully']);
    }




    public function UseruserLogs($project_id,$user_id)
    {
        $logs = UserLog::select(
                'user_logs.*', 
                'users.name as user_name', 
                'users.role as user_role', 
                'users.position as user_position', 
                'users.status as user_status', 
                'users.profile_picture as user_profile_picture',
                'tasks.name as task_name'
            )
            ->where('user_logs.project_id', $project_id)
            ->where('user_logs.user_id',$user_id)
            ->join('users', 'user_logs.user_id', '=', 'users.id')
            ->join('tasks', 'user_logs.task_id', '=', 'tasks.id')
            ->get()
            ->groupBy('user_id'); 

        // Restructure response
        $formattedLogs = $logs->map(function ($userLogs, $userId) {
        
            // $totalCost = $userLogs->sum(function ($log) {
            //     return (float) $log->total_cost ?: 0; // Sum total_cost values
            // });

            $logCount = $userLogs->count();
            
            // Calculate progress percentage
            $finishedLogsCount = $userLogs->where('status', 'finished')->count(); // Count logs with status "finished"
            $progressPercentage = $logCount > 0 ? round(($finishedLogsCount / $logCount) * 100, 2) : 0;

            return [
                'user_id' => $userId,
                'user_name' => $userLogs->first()->user_name,
                'user_role' => $userLogs->first()->user_role,
                'user_position' => $userLogs->first()->user_position,
                'user_status' => $userLogs->first()->user_status,
                'user_profile_picture' => $userLogs->first()->user_profile_picture,
            
                'progress_percentage' => $progressPercentage, 
                'allocated_dates' => $userLogs->count(),
                'log' => $userLogs->map(function ($log) {
                    return [
                        'id' => $log->id,
                        'task_id' => $log->task_id,
                        'task_name' => $log->task_name,
                        'title' => $log->title,
                        'description' => $log->description,
                        'date' => $log->date,
                        'status' => $log->status,
                        'start_time' => $log->start_time,
                        'end_time' => $log->end_time,
                        'work_quality' => $log->work_quality,
                    ];
                })->values()
            ];
        })->values();

        return response()->json($formattedLogs);
    }  



}
