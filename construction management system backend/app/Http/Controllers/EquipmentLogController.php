<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EquipmentLog;
use App\Models\Equipment;
use App\Models\Estimation;

class EquipmentLogController extends Controller
{
    //


    public function store(Request $request)
    {
        $request->validate([    
            'task_id' => 'required|exists:tasks,id',
            'project_id' => 'required|exists:projects,id',
            'equipment_id' => 'required|exists:equipment,id',

            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            
            'date' => 'required|date',
            'status' => 'required|string|max:255',

            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after_or_equal:start_time',


            'quantity' => 'nullable|numeric',
            'unit_price' => 'nullable|numeric',
            'total_cost' => 'nullable|numeric',
          
        ]);

        $equipementLog =  EquipmentLog::create([
            'task_id' => $request->task_id,
            'project_id' =>  $request->project_id,
            'equipment_id' =>  $request->equipment_id,

            'title' =>  $request->title,
            'description' =>  $request->description,
            
            'date' =>  $request->date,
            'status' =>  $request->status,

            'start_time' => $request->start_time,
            'end_time' =>  $request->end_time,
        ]);


        // for equipment name retun 
        // equipment name return for if need estimations 
        $equipment = Equipment::findOrFail($request->equipment_id);
        $equipment_name = $equipment->name;

        if($request->total_cost){

            Estimation::create([
                'project_id' =>  $equipementLog->project_id,
                'task_id' =>  $equipementLog->task_id,
                
                'title' => $equipment_name.'- Equipment cost',
                'cost_type' => 'Equipment Cost',
                'unit' => 'Hours',
                'quantity' => $request->quantity,
                'unit_price' => $request->unit_price,
                'total_cost' => $request->total_cost,
    
                'referenced_id' => $equipementLog->id, 
            ]);
        }

        return response()->json(['message' => 'Equipment Log created successfully' ], 201);
    }



    public function equipmentLogDates(){

        $equipment = Equipment::with('equipmentLogs')->get();

        return response()->json($equipment);
    }



    public function equipmentLogDatesUser($equipment_id){
        $equipment = Equipment::with('equipmentLogs')->find($equipment_id);

        return response()->json($equipment);

    }



    // equipment logs by each task
    
    public function equipmentLogsForByTask($task_id)
    {
        $logs = EquipmentLog::select(
                'equipment_logs.*', 
                'equipment.name as equipment_name', 
                'equipment.serial_number as equipment_serial_number', 
                'equipment.status as equipment_status', 
                'equipment.category as equipment_category', 
                'equipment.image as equipment_image'
            )
            ->where('equipment_logs.task_id', $task_id)
            ->join('equipment', 'equipment_logs.equipment_id', '=', 'equipment.id')
            ->get()
            ->groupBy('equipment_id'); 

            $formattedLogs = $logs->map(function ($equipmentLogs, $equipmentId) {

                $logCount = $equipmentLogs->count(); // Total logs count
            
                // Calculate progress percentage
                $finishedLogsCount = $equipmentLogs->where('status', 'finished')->count(); // Count logs with status "finished"
                $progressPercentage = $logCount > 0 ? round(($finishedLogsCount / $logCount) * 100, 2) : 0;
        
                return [
                    'equipment_id' => $equipmentId,
                    'equipment_name' => $equipmentLogs->first()->equipment_name,
                    'equipment_serial_number' => $equipmentLogs->first()->equipment_serial_number,
                    'equipment_status' => $equipmentLogs->first()->equipment_status,
                    'equipment_image' => $equipmentLogs->first()->equipment_image,
                    'equipment_category' => $equipmentLogs->first()->equipment_category,
                    'progress_percentage' => $progressPercentage, 
                    'allocated_dates' => $equipmentLogs->count(),
                    'log' => $equipmentLogs->map(function ($log) {
                        return [
                            'id' => $log->id,
                            'project_id' => $log->project_id,
                            'task_id' => $log->task_id,
                            'title' => $log->title,
                            'description' => $log->description,
                            'date' => $log->date,
                            'status' => $log->status,
                            'start_time' => $log->start_time,
                            'end_time' => $log->end_time,
                          
                        ];
                    })->values()
                   
                ];
            })->values();

        return response()->json($formattedLogs);
    }



    // equipment logs by each project
    
    public function equipmentLogsForByProjet($project_id)
    {
        $logs = EquipmentLog::select(
                'equipment_logs.*', 
                'equipment.name as equipment_name', 
                'equipment.serial_number as equipment_serial_number', 
                'equipment.status as equipment_status', 
                'equipment.category as equipment_category', 
                'equipment.image as equipment_image',
                'tasks.name as task_name' 
            )
            ->where('equipment_logs.project_id', $project_id)
            ->join('equipment', 'equipment_logs.equipment_id', '=', 'equipment.id')
            ->join('tasks', 'equipment_logs.task_id', '=', 'tasks.id')
            ->get()
            ->groupBy('equipment_id'); 

            $formattedLogs = $logs->map(function ($equipmentLogs, $equipmentId) {

                $logCount = $equipmentLogs->count(); // Total logs count
            
                // Calculate progress percentage
                $finishedLogsCount = $equipmentLogs->where('status', 'Finished')->count(); // Count logs with status "finished"
                $progressPercentage = $logCount > 0 ? round(($finishedLogsCount / $logCount) * 100, 2) : 0;
        
                return [
                    'equipment_id' => $equipmentId,
                    'equipment_name' => $equipmentLogs->first()->equipment_name,
                    'equipment_serial_number' => $equipmentLogs->first()->equipment_serial_number,
                    'equipment_status' => $equipmentLogs->first()->equipment_status,
                    'equipment_image' => $equipmentLogs->first()->equipment_image,
                    'equipment_category' => $equipmentLogs->first()->equipment_category,
                    'progress_percentage' => $progressPercentage, 
                    'allocated_dates' => $equipmentLogs->count(),
                    'log' => $equipmentLogs->map(function ($log) {
                        return [
                            'id' => $log->id,
                            'project_id' => $log->project_id,
                            'task_id' => $log->task_id,
                            'task_name' => $log->task_name, // Include task name
                            'title' => $log->title,
                            'description' => $log->description,
                            'date' => $log->date,
                            'status' => $log->status,
                            'start_time' => $log->start_time,
                            'end_time' => $log->end_time,
                          
                        ];
                    })->values()
                   
                ];
            })->values();

        return response()->json($formattedLogs);
    }


    // user log by date


    public function EquipmentLog($task_id,$date){

        $log = EquipmentLog::select(
            'equipment_logs.*','equipment.name as equipment_name' , 'equipment.serial_number as equipment_serial_number' , 'equipment.image as equipment_image',  'estimations.unit','estimations.unit_price','estimations.quantity','estimations.total_cost',  'estimations.id as estimations_id',
             'actual_costs.id as actual_cost_id',  'actual_costs.unit as actual_cost_unit','actual_costs.unit_price as actual_cost_unit_price','actual_costs.quantity as actual_cost_quantity',  'actual_costs.total_cost as actual_cost_total_cost'
            
            )
            ->where('equipment_logs.task_id',$task_id)
            ->where('equipment_logs.date',$date)
            ->join('equipment', 'equipment.id', '=', 'equipment_logs.equipment_id')
          
            ->leftJoin('estimations', function($join) {
                $join->on('equipment_logs.id', '=', 'estimations.referenced_id')
                     ->where('estimations.cost_type', 'Equipment Cost');
            })
            ->leftJoin('actual_costs', function($join) {
                $join->on('estimations.id', '=', 'actual_costs.estimation_id');
            })
            ->orderBy('equipment_logs.id')
            ->get();

        return response()->json($log);
    }
    


  
    



// update

    public function update(Request $request, $id)
    {
       
        $equipmentLog = EquipmentLog::findOrFail($id);
    
 
        $validated = $request->validate([

            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string', 
            
            'date' => 'nullable|date',
            'status' => 'required|string|max:255',

            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after_or_equal:start_time',
        
        ]);
    

        $equipmentLog->update($validated);
    
    
        return response()->json([
            'succrss' => true,
            'message' => 'Equipment log updated successfully'
        ]);
    }


    public function equipmentLogGrouped($equipment_id)
    {
        $myTasks = EquipmentLog::select('equipment_logs.*', 'tasks.name as task_name', 'projects.name as project_name')
            ->where('equipment_logs.equipment_id', $equipment_id)
            ->join('tasks', 'tasks.id', '=', 'equipment_logs.task_id')
            ->join('projects', 'projects.id', '=', 'equipment_logs.project_id')
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



    public function equipentLogSelected($id)
    {
        $equipmentLog = EquipmentLog::findOrFail($id);
    
        return response()->json( $equipmentLog);
    }
    

    public function delete($id)
    {
        $equipmentLog = EquipmentLog::findOrFail($id);
        $equipmentLog->delete();

        return response()->json(['message' => 'Equipment Log deleted successfully']);
    }



 
    public function equipentEquipmentLog($project_id,$equipment_id)
    {
        $logs = EquipmentLog::select(
                'equipment_logs.*', 
                'equipment.name as equipment_name', 
                'equipment.serial_number as equipment_serial_number', 
                'equipment.status as equipment_status', 
                'equipment.category as equipment_category', 
                'equipment.image as equipment_image',
                'tasks.name as task_name' 
            )
            ->where('equipment_logs.project_id', $project_id)
            ->where('equipment_logs.equipment_id', $equipment_id)
            ->join('equipment', 'equipment_logs.equipment_id', '=', 'equipment.id')
            ->join('tasks', 'equipment_logs.task_id', '=', 'tasks.id')
            ->get()
            ->groupBy('equipment_id'); 

            $formattedLogs = $logs->map(function ($equipmentLogs, $equipmentId) {

                $logCount = $equipmentLogs->count(); // Total logs count
            
                // Calculate progress percentage
                $finishedLogsCount = $equipmentLogs->where('status', 'Finished')->count(); // Count logs with status "finished"
                $progressPercentage = $logCount > 0 ? round(($finishedLogsCount / $logCount) * 100, 2) : 0;
        
                return [
                    'equipment_id' => $equipmentId,
                    'equipment_name' => $equipmentLogs->first()->equipment_name,
                    'equipment_serial_number' => $equipmentLogs->first()->equipment_serial_number,
                    'equipment_status' => $equipmentLogs->first()->equipment_status,
                    'equipment_image' => $equipmentLogs->first()->equipment_image,
                    'equipment_category' => $equipmentLogs->first()->equipment_category,
                    'progress_percentage' => $progressPercentage, 
                    'allocated_dates' => $equipmentLogs->count(),
                    'log' => $equipmentLogs->map(function ($log) {
                        return [
                            'id' => $log->id,
                            'project_id' => $log->project_id,
                            'task_id' => $log->task_id,
                            'task_name' => $log->task_name, // Include task name
                            'title' => $log->title,
                            'description' => $log->description,
                            'date' => $log->date,
                            'status' => $log->status,
                            'start_time' => $log->start_time,
                            'end_time' => $log->end_time,
                          
                        ];
                    })->values()
                   
                ];
            })->values();

        return response()->json($formattedLogs);
    }

    


}
