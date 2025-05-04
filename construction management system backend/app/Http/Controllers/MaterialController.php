<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Estimation;

use App\Models\MaterialLog;



class MaterialController extends Controller
{
    //



    public function store(Request $request)
    {
        $request->validate([    
            'task_id' => 'required|exists:tasks,id',
            'project_id' => 'required|exists:projects,id',
         
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            
            'date' => 'required|date',
            'status' => 'required|string|max:255',

            
            'unit' => 'nullable|string|max:255',
            'quantity' => 'nullable|numeric',
            'unit_price' => 'nullable|numeric',
            'total_cost' => 'nullable|numeric',
          
        ]);

        $materialLog =  MaterialLog::create([
            'task_id' => $request->task_id,
            'project_id' =>  $request->project_id,
            'title' =>  $request->title,
            'description' =>  $request->description,
            'date' =>  $request->date,
            'status' =>  $request->status,


        ]);


        if($request->total_cost){

            Estimation::create([
                'project_id' => $request->project_id,
                'task_id' => $request->task_id,
                
                'title' =>$request->title,
                'cost_type' => 'Material Cost',
                'unit' =>  $request->unit,
                'quantity' => $request->quantity,
                'unit_price' => $request->unit_price,
                'total_cost' => $request->total_cost,
    
                'referenced_id' => $materialLog->id, 
            ]);
        }

        return response()->json(['message' => 'Material Log created successfully' ], 201);
    }


//

    public function materialsByTasks($task_id){
       
       $materials = MaterialLog::select('material_logs.*')
        ->where('material_logs.task_id',$task_id)
        ->get()
        ->groupBy('title');

          // Convert to desired format
            $formattedMaterials = [];
            foreach ($materials as $title => $items) {
                $formattedMaterials[] = [
                    'name' => $title, // Renaming 'title' to 'name'
                    'materials' => $items
                ];
            }

            return response()->json($formattedMaterials);
    }



    public function materialsByProject($project_id)
    {
        $materials = MaterialLog::select('material_logs.*', 'tasks.name as task_name', 'tasks.id as task_id')
            ->where('material_logs.project_id', $project_id)
            ->join('tasks', 'tasks.id', '=', 'material_logs.task_id')
            ->get()
            ->groupBy('task_id'); 
    
        $formattedMaterials = [];
    
        foreach ($materials as $taskId => $items) {
            $taskName = $items->first()->task_name; 
            $formattedMaterials[] = [
                "task_id" => $taskId,
                "task_name" => $taskName,
                "materials" => $items,
            ];
        }
    
        return response()->json($formattedMaterials);
    }
    


        // Material  Log  by date


        public function MaterialLog($task_id,$date){

            $log = MaterialLog::select('material_logs.*',  'estimations.unit','estimations.unit_price','estimations.quantity','estimations.total_cost',
            'estimations.id as estimations_id',
             'actual_costs.id as actual_cost_id',  'actual_costs.unit as actual_cost_unit','actual_costs.unit_price as actual_cost_unit_price','actual_costs.quantity as actual_cost_quantity',  'actual_costs.total_cost as actual_cost_total_cost'
             )
                ->where('material_logs.task_id',$task_id)
                ->where('material_logs.date',$date)
                // ->join('equipment', 'equipment.id', '=', 'equipment_logs.equipment_id')
              
                ->leftJoin('estimations', function($join) {
                    $join->on('material_logs.id', '=', 'estimations.referenced_id')
                         ->where('estimations.cost_type', 'Material Cost');
                })
                ->leftJoin('actual_costs', function($join) {
                    $join->on('estimations.id', '=', 'actual_costs.estimation_id');
                })
                ->orderBy('material_logs.id')
                ->get();
    
            return response()->json($log);
        }



    // update log


    public function update(Request $request, $id)
    {
       
        $materialLog = MaterialLog::findOrFail($id);
    
 
        $validated = $request->validate([

            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string', 
            
            'date' => 'nullable|date',
            'status' => 'required|string|max:255',

        ]);
    

        $materialLog->update($validated);
    
    
        return response()->json([
            'succrss' => true,
            'message' => 'Material log updated successfully'
        ]);
    }

    public function materialLogSelected($id)
    {
        $materialLog = MaterialLog::findOrFail($id);
    
        return response()->json( $materialLog);
    }
    

    public function delete($id)
    {
        $materialLog = MaterialLog::findOrFail($id);
        $materialLog->delete();

        return response()->json(['message' => 'Material Log deleted successfully']);
    }




    
}
