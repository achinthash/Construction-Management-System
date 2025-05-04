<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Estimation;
use App\Models\Task;
use App\Models\ActualCost;
use App\Models\UserLog;


class EstimationController extends Controller
{
    //
 
    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',//
            'task_id' => 'required|exists:tasks,id', //
            
            'title' => 'required|string|max:255',
            'cost_type' => 'required|string',
            'unit' => 'required|string',
            'quantity' => 'required|numeric',
            'unit_price' => 'required|numeric',
            'total_cost' => 'required|numeric',

            'referenced_id' => 'nullable|numeric', //
        ]);

        $estimation = Estimation::create($request->all());


        return response()->json(['message' => 'Estimation created successfully'], 201);
    }



    public function update(Request $request, $id)
    {
        $estimation = Estimation::findOrFail($id);

        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'task_id' => 'required|exists:tasks,id', 
            'title' => 'required|string|max:255',
            'cost_type' => 'required|string',
            'unit' => 'required|string',
            'quantity' => 'required|numeric',
            'unit_price' => 'required|numeric',
            'total_cost' => 'required|numeric',

            'referenced_id' => 'nullable|numeric', 
        ]);

        $estimation->update($request->all());

        return response()->json(['message' => 'Estimation updated successfully'],201);
    }


    public function delete($id)
    {
        $estimation = Estimation::findOrFail($id);
        $estimation->delete();

        return response()->json(['message' => 'Estimation deleted successfully']);
    }





    public function show($id)
    {
        return response()->json(Estimation::findOrFail($id));
    }



    public function estimations($project_id)
    {
        
        $tasks = Task::where('project_id', $project_id)->get();
    
       
        $estimations = Estimation::select(
                'estimations.*', 
                'tasks.name as task_name', 
                'tasks.id as task_id'
            )
            ->where('estimations.project_id', $project_id)
            ->leftJoin('tasks', 'estimations.task_id', '=', 'tasks.id')
            ->get()
            ->groupBy('task_id');
    
        $formattedEstimations = $tasks->map(function ($task) use ($estimations) {

            return [
                'task_id' => $task->id,
                'task_name' => $task->name,
                'estimations' => isset($estimations[$task->id]) 
                    ? $estimations[$task->id]->map(function ($est) {
                        return [
                            'id' => $est->id,
                            'title' => $est->title,
                            'cost_type' => $est->cost_type,
                            'unit' => $est->unit,
                            'quantity' => $est->quantity,
                            'unit_price' => $est->unit_price,
                            'total_cost' => $est->total_cost,
                        ];
                    })->values()
                    : []
            ];
        });
    
        return response()->json($formattedEstimations);
    }


    // estimation seleccted


    public function estVsActSelectedEdit($id)
    {
        $actualCost = ActualCost::where('estimation_id', $id)->first();
    
        if ($actualCost) {
            return response()->json($actualCost);
        } else {
            $estimation = Estimation::find($id);
    
            if ($estimation) {
                return response()->json($estimation);
            } else {
                return response()->json(['message' => 'Estimation not found'], 404);
            }
        }
    }



    
    


    // estimation summary for projct base
    public function estimationSummary($project_id)
    {
        $estimations = Estimation::where('project_id', $project_id)->get();
    
        // Group estimations by cost type
        $costTypeGroups = $estimations->groupBy('cost_type')->map(function ($group, $costType) {
            return [
                'cost_type' => $costType,
                'total_cost' => number_format($group->sum('total_cost'), 2, '.', ''),
            ];
        })->values();
    
        // Sum of all total costs
        $overallTotalCost = number_format($estimations->sum('total_cost'), 2, '.', '');
    
        return response()->json([
            'cost_types' => $costTypeGroups,
            'overall_total_cost' => $overallTotalCost
        ]);
    }


    public function estimationsByTask($task_id){

        $estimations =  Estimation::where('task_id', $task_id)->get();

        return response()->json($estimations);
    }



    // actual cost section


    public function estwithactualTask($task_id){

        $data = Estimation::with('actualCost')->where('task_id',$task_id)->get();
        return response()->json($data);
    }


    public function estwithactualProject($project_id){

        $data = Estimation::with('actualCost')->where('project_id',$project_id)->get();
        return response()->json($data);
    }

    public function estwithactualSelected($id){

        $data = Estimation::with('actualCost','task:id,name','project:id,name')->where('id',$id)->first();
        return response()->json($data);
    }

    // for char line
    public function taskwise($project_id)
    {
        $estimations = Estimation::with('task')
            ->where('project_id', $project_id)
            ->get()
            ->groupBy('task_id')
            ->map(function ($group) {
                $taskName = optional($group->first()->task)->name;
                $totalEstimated = $group->sum('total_cost');
                $totalActual = $group->sum(function ($e) {
                    return optional($e->actualCost)->total_cost ?? 0;
                });
    
                return [
                    'task_id' => $group->first()->task_id,
                    'task_name' => $taskName,
                    'total_estimated_cost' => $totalEstimated,
                    'total_actual_cost' => $totalActual,
                ];
            })
            ->values(); // reset the keys
    
        return response()->json($estimations);
    }



    
    

        
    //

  // actual cost summary for projct base


  public function actualcostSummary($project_id){
   
    $data = Estimation::with('actualCost')->where('project_id',$project_id)->get();

    $filtered = $data->filter(function ($item){
        return $item->actualCost !== null;
    });

    $grouped = $filtered->groupBy(function ($item) {
        return $item->actualCost->cost_type;
    });

    $costTypeGroups = $grouped->map(function ($group,$costType){
        
       $total = $group->sum(function ($item) {
            return (float) $item->actualCost->total_cost;
        });
        return [
            'cost_type' => $costType,
            'total_cost' => number_format($total, 2, '.', ''),
        ];
    })->values();


       // Sum of all total costs
       $overallTotalCost = number_format($costTypeGroups->sum(function ($item){
        return (float) $item['total_cost'];
        }), 2, '.', '');
     
       return response()->json([
           'cost_types' => $costTypeGroups,
           'overall_total_cost' => $overallTotalCost
       ]);


 }

 public function materialQuantity($project_id){

    $estimation = Estimation::where('project_id',$project_id)->where('cost_type','Material Cost')->get();

    return response()->json($estimation);
 }


 
}
