<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QualityControl;

use App\Models\Task;

class QualityControlController extends Controller
{
    //


    public function store(Request $request){

       $validated = $request->validate([

            'project_id' => 'required|exists:projects,id',
            'task_id' => 'required|exists:tasks,id',
            'title' => 'required|string|max:255',
            'status' => 'required|in:Pending,In Progress,Approved,Rejected,Completed',
            'description' => 'nullable|string|max:255',
            
            'expected_check_date' => 'nullable|date',
            'checked_by' =>  'nullable|exists:users,id',
            'checked_date' => 'nullable|date',
            'comment' => 'nullable|string|max:255',
            'action_required' => 'nullable|string|max:255',
            'resolution_date' => 'nullable|date'

        ]);


        $qualityControl = QualityControl::create($validated);

        return response()->json([
            'message' => 'Quality Control Created Successfully',
            'data' => $qualityControl
        ], 201);

    }


    public function qulityControlsByProject($project_id){


        $tasks = Task::where('project_id', $project_id)->get();

        
        $qualityControl = QualityControl::select('quality_controls.*','tasks.name as task_name', 'tasks.id as task_id','users.name as checked_user')
            ->where('quality_controls.project_id', $project_id)
            ->leftJoin('tasks', 'quality_controls.task_id', '=', 'tasks.id')
            ->join('users', 'quality_controls.checked_by', '=', 'users.id')
            ->get()
            ->groupBy('task_id');


        $formatedQualityConrols = $tasks->map(function ($task) use ($qualityControl) {

            return[

                'task_id' => $task->id,
                'task_name' => $task->name,
                'quality_controls'=> isset($qualityControl[$task->id]) 
                ? $qualityControl[$task->id]->map(function ($qac) {
                    return [
                        'id' => $qac->id,
                        'title' => $qac->title,
                        'description' => $qac->description,
                        'checked_by' => $qac->checked_by,
                        'checked_user' => $qac->checked_user,
                        'checked_date' => $qac->checked_date,
                        'status' => $qac->status,
                        'comment' => $qac->comment,
                        'action_required' => $qac->action_required,
                        'resolution_date' => $qac->resolution_date,
                    ];
                })->values()
                : []
            ];  

        });
        
        return response()->json($formatedQualityConrols);


    }


    public function qulityControlsByTask($task_id){

        $qualityControl = QualityControl::where('task_id', $task_id)->get();

        return response()->json($qualityControl);


    }

    public function qualityControlWork($task_id, $date){

        $qualityControl = QualityControl::Select('quality_controls.*','users.name as checker_name')
            ->where('quality_controls.task_id',$task_id)
            ->where('quality_controls.expected_check_date',$date)
            ->leftjoin('users', 'users.id' , '=' , 'quality_controls.checked_by')
            ->get();

        return response()->json($qualityControl);
    }


    public function update(Request $request,$id){

        $validated = $request->validate([
 
            'title' => 'nullable|string|max:255',
            'status' => 'nullable|in:Pending,In Progress,Approved,Rejected,Completed',
            'description' => 'nullable|string|max:255',
            
            'expected_check_date' => 'nullable|date',
            'checked_by' =>  'nullable|exists:users,id',
            'checked_date' => 'nullable|date',
            'comment' => 'nullable|string|max:255',
            'action_required' => 'nullable|string|max:255',
            'resolution_date' => 'nullable|date'
 
         ]);
         $qualityControl = QualityControl::findOrFail($id);
 
         $qualityControl->update($validated);
 
         return response()->json([
             'message' => 'Quality Control Update Successfully' ], 201);
 
     }



     public function delete($id){

        $qualityControl = QualityControl::findOrfail($id);

        $qualityControl->delete();

        return response()->json(['message' => 'Quality Control deleted successfully'], 200);

    }


    public function qualityControlSelected($id)
    {
        $qualityControl = QualityControl::select('quality_controls.*', 'tasks.name as task_name','users.name as checked_user') 
        ->join('tasks', 'quality_controls.task_id', '=', 'tasks.id')
        ->join('users', 'quality_controls.checked_by', '=', 'users.id')
        ->where('quality_controls.id', $id)
        ->first();
    
        return response()->json($qualityControl);
    }


}
