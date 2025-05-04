<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\TaskDate; 
use App\Models\TaskDependent; 

use App\Models\DailyLogIssues; 



class TaskController extends Controller
{
    //

    public function store(Request $request){

      

        $request->validate([
            'project_id'  => ['required', 'exists:projects,id'],
            'name'  => ['required', 'string', 'max:25'],
            'status' => ['required', 'string', 'max:25'],
            'start_date' => ['nullable', 'date', ],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'progress' => ['required', 'numeric', 'min:0', 'max:100'],
            'description' => ['required', 'string', 'max:255'],
            'priority'  => ['required', 'string'],


            // task dates
            'task_dates' => ['nullable', 'array'],

            'task_dates.*.date' => ['nullable', 'date'],
            'task_dates.*.description' => ['nullable', 'string'],
            'task_dates.*.status'      => ['nullable', 'string'],
  
            'dependent_task_id'  => ['nullable', 'exists:tasks,id'],

        ]);


        $task = Task::create([

            'project_id'  =>  $request->project_id,
            'name'  => $request->name,
            'status' => $request->status,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'progress' => $request->progress,
            'description' => $request->description,
            'priority'  => $request->priority,

        ]);

        if(!empty($request->dependent_task_id)){
            
            TaskDependent::create([
                'task_id' => $task->id,
                'dependent_task_id' => $request->dependent_task_id
            ]);
       
        }

        if(!empty($request->task_dates)){

            foreach($request->task_dates as $date){

                TaskDate::create([
                    'project_id'     => $task->project_id,
                    'task_id'     => $task->id,
                    'date'        => $date['date'],
                    'description' => $date['description'] ?? null,
                    'status'      => $date['status'],
                ]);
            }

        }
     
        return response()->json(['message'=> 'Task Created Successfully!']);
    } 

    
    public function storeTaskDate(Request $request)
    {

        $validated = $request->validate([
            'project_id' => ['required', 'exists:projects,id'],
            'task_id' => ['required', 'exists:tasks,id'],
            'status' => ['nullable', 'string', 'max:25'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $taskDate = TaskDate::create($validated);

        return response()->json(['success' => true,'message' => 'Task date created successfully',], 201);
    }



    // tasks all on selected project 
    public function tasks($project_id){
        
        $task = Task::select('tasks.*')
                    ->where('tasks.project_id',$project_id)
                    ->get();
                    
        return response()->json($task);
    }


    // selected task 
    public function task($id){
        $task = Task::findOrfail($id);

        return response()->json($task);
    }


    // tasks with dates 


    public function tasksWithDates($id){
       // TaskDate
        $task = Task::findOrfail($id);

        $taskDates = TaskDate::where('task_id',$task->id)
            ->get(['task_dates.id','task_dates.date','task_dates.description', 'task_dates.status']);

        $task->taskDates = $taskDates;

        return response()->json($task);


        
    }

    // tasks dates with task 

    public function tasksDates($project_id){

        $tasks = Task::select('tasks.name','task_dates.*')
        ->where('tasks.project_id', $project_id)
        ->join('task_dates', 'task_dates.task_id', '=', 'tasks.id' )
            ->get();

        return response()->json($tasks);
    }


    // task details from date available task

    public function work($project_id, $date)
    {
        $taskDates = TaskDate::select('task_dates.*', 
        
        'tasks.id as task_id', 
        'tasks.name as task_name',  
        'tasks.status as task_status' ,
        'tasks.start_date as task_start_date', 
        'tasks.end_date as task_end_date',
        'tasks.progress as task_progress',
        'tasks.description as task_description' ,
        'tasks.priority as task_priority'  ,
        
        'projects.name as project_name')
            ->where('date', $date)
            ->join('tasks', 'tasks.id', '=', 'task_dates.task_id')
            ->join('projects', 'projects.id', '=', 'tasks.project_id')
            ->where('projects.id', $project_id)
            ->get();
    
        if ($taskDates->isEmpty()) {
            return response()->json(['message' => 'No tasks found for this date'], 404);
        }


        $taskId = $taskDates->first()->task_id;
       
    
            // Fetch all task IDs in the current selection
        $taskIds = $taskDates->pluck('task_id');

        // Fetch all task dates for the relevant tasks
        $allTaskDates = TaskDate::whereIn('task_id', $taskIds)
            ->orderBy('date')
            ->get(['task_id', 'id', 'date']);
    
        // Add extra fields directly in each task object
        $taskDates = $taskDates->map(function ($task) use ($allTaskDates, $date) {
            // Get all dates for the specific task
            $datesForTask = $allTaskDates->where('task_id', $task->task_id);
            
            return array_merge($task->toArray(), [
                'date_position' => $datesForTask->pluck('date')->search($date) + 1,
                'total_dates' => $datesForTask->count()
            ]);
        });
        return response()->json($taskDates);
     
    }



    public function workSelected($id)
    {
        $taskDates = TaskDate::select('task_dates.*', 
        
        'tasks.id as task_id', 
        'tasks.name as task_name',  
        'tasks.status as task_status' ,
        'tasks.start_date as task_start_date', 
        'tasks.end_date as task_end_date',
        'tasks.progress as task_progress',
        'tasks.description as task_description' ,
        'tasks.priority as task_priority'  ,
        
        'projects.name as project_name')
            ->where('task_dates.id', $id)
            ->join('tasks', 'tasks.id', '=', 'task_dates.task_id')
            ->join('projects', 'projects.id', '=', 'tasks.project_id')
          
            ->first();
    
        if (!$taskDates) {
            return response()->json(['message' => 'No tasks found for this date'], 404);
        }

        // Fetch all task dates for the same task
        $allTaskDates = TaskDate::where('task_id', $taskDates->task_id)
        ->orderBy('date')
        ->get(['task_id', 'id', 'date']);


        $totalDates = $allTaskDates->count();
     
        $datePosition = $allTaskDates->pluck('date')->search($taskDates->date) + 1;

        // Attach additional data
        $taskDates->total_dates = $totalDates;
        $taskDates->date_position = $datePosition;

        return response()->json($taskDates);
     
    }

    public function taskDateSelected($id){

        $taskDate = TaskDate::findOrFail($id);
        return response()->json($taskDate);
    }
    




    // update task date // status, start time 
    // for works start 

    public function updateTaskDate(Request $request, $id)
    {
       
        $taskDate = TaskDate::findOrFail($id);
    
        $validated = $request->validate([
            'status' => ['nullable', 'string', 'max:25'],
            'description' => ['nullable', 'string', 'max:255'],
            'weather_condition' => ['nullable', 'string', 'max:255'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after_or_equal:start_time'], 
            'general_note' => ['nullable', 'string', 'max:255'],
        ]);
    

        $taskDate->update($validated);
    
    
        return response()->json([
            'succrss' => true,
            'message' => 'Task date updated successfully'
        ]);
    }


    public function update(Request $request, $id){

        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'project_id'  => ['required', 'exists:projects,id'],
            'name'  => ['required', 'string', 'max:25'],
            'status' => ['required', 'string', 'max:25'],
            'start_date' => ['nullable', 'date', ],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'progress' => ['required', 'numeric', 'min:0', 'max:100'],
            'description' => ['required', 'string', 'max:255'],
            'priority'  => ['required', 'string'],

        ]);

        $task->update($validated);

        return response()->json([
            'succrss' => true,
            'message' => 'Task updated successfully'
        ]);



    }
    


    public function DalityLogIssuesStore(Request $request)
    {
   
        $validated = $request->validate([
            'task_date_id' => 'required|exists:task_dates,id',
            'task_id' => 'required|exists:tasks,id',
            'project_id' => 'required|exists:projects,id',
            'issue' => 'required|string',
            'impact' => 'required|string',
            'action_taken' => 'required|string',
        ]);

       
        $dailyLogIssues = DailyLogIssues::create($validated);

        return response()->json([
            'message' => 'Daily log issues added successfully!',
            'daily_log' => $dailyLogIssues,
        ]);
    }


    // for work
    public function dailyLogissuesWork($id){

        $issues = DailyLogIssues::select('daily_log_issues.*')
            ->where('daily_log_issues.task_date_id',$id)
            ->get();

            return response()->json($issues);

    }


    public function tasksWithDatesProject($project_id){

        $task = Task::with('dates')->where('project_id',$project_id)->get();

        return response()->json($task);
    }
    


    // daily logs

    public function tasksLogsProjects($project_id)
    {
        $logs = TaskDate::where('task_dates.project_id', $project_id)
            ->get();
    
        return response()->json($logs);
    }

      public function tasksLogsTasks($project_id,$task_id)
    {
        $logs = TaskDate::where('task_dates.project_id', $project_id)->where('task_dates.task_id',$task_id)
            ->get();
    
        return response()->json($logs);
    }


    public function delete($id){

        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }

    
    public function deleteTaskDate($id){

        $taskDate = TaskDate::findOrFail($id);
        $taskDate->delete();

        return response()->json(['message' => 'Task date deleted successfully']);
    }

    
}

