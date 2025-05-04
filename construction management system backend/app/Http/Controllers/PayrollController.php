<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payroll;

class PayrollController extends Controller
{
    //


    public function store(Request $request)
    {
   
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
            'wagetype' => 'required|string',
            'wage_rate' => 'required|numeric',
            'worked_date' => 'required|date',
            'worked_hours' => 'required|numeric',
            'status' => 'nullable|in:Pending,Paid,Processed', 
            'total_earned' => 'required|numeric',

        ]);

        $payroll = Payroll::create($validated);

        return response()->json(['message' => 'Payroll created successfully']);
    }



    public function payrollProjectWise($project_id)
    {
        $payrolls = Payroll::select('payrolls.*', 'users.name as user_name', 'users.role as user_role')
            ->where('payrolls.project_id', $project_id)
            ->join('users', 'users.id', '=', 'payrolls.user_id')
            ->orderBy('payrolls.user_id')
            ->get();
    
        $grouped = $payrolls->groupBy('user_id')->map(function ($records, $user_id) {
            $totalEarned = $records->sum('total_earned');
            $totalPaid = $records->where('status', 'Paid')->sum('total_earned'); // or use (status == 1) if status is integer
            $remaining = $totalEarned - $totalPaid;
    
            return [
                'user_id' => $user_id,
                'user_name' => $records->first()->user_name,
                'user_role' => $records->first()->user_role,
                'total_earned' => $totalEarned,
                'total_paid' => $totalPaid,
                'remaining' => $remaining,
                'payroll_entries' => $records->map(function ($record) {
                    return [
                        'id' => $record->id,
                        'project_id' => $record->project_id,
                        'wagetype' => $record->wagetype,
                        'wage_rate' => $record->wage_rate,
                        'worked_date' => $record->worked_date,
                        'worked_hours' => $record->worked_hours,
                        'total_earned' => $record->total_earned,
                        'status' => $record->status,
                        'created_at' => $record->created_at,
                        'updated_at' => $record->updated_at,
                    ];
                }),
            ];
        })->values(); // reset keys for JSON
    
        return response()->json($grouped, 200);
    }
    

    public function payrollProjectSummary($project_id)
    {
        // Get payroll entries for the given project
        $payrolls = Payroll::where('project_id', $project_id)->get();

        // Calculate totals
        $total_earned = $payrolls->sum('total_earned');
        $total_paid = $payrolls->where('status', 'Paid')->sum('total_earned'); // assuming 'Paid' is your status
        $total_remaining = $total_earned - $total_paid;

        // Return JSON response
        return response()->json([
            'project_id' => $project_id,
            'total_earned' => round($total_earned, 2),
            'total_paid' => round($total_paid, 2),
            'total_remaining' => round($total_remaining, 2),
        ]);
    }


    // payroll  users wise 




    public function payrollUserWise($user_id)
    {
        $payrolls = Payroll::select('payrolls.*', 'projects.name as project_name')
            ->where('payrolls.user_id', $user_id)
            ->join('projects', 'projects.id', '=', 'payrolls.project_id')
            ->orderBy('payrolls.project_id')
            ->get();
    
        $grouped = $payrolls->groupBy('project_id')->map(function ($records, $project_id) {
            $totalEarned = $records->sum('total_earned');
            $totalPaid = $records->where('status', 'Paid')->sum('total_earned');
            $remaining = $totalEarned - $totalPaid;
    
            return [
                'project_id' => $project_id,
                'project_name' => $records->first()->project_name,
     
                'total_earned' => $totalEarned,
                'total_paid' => $totalPaid,
                'remaining' => $remaining,
                'payroll_entries' => $records->map(function ($record) {
                    return [
                        'id' => $record->id,
                        'project_id' => $record->project_id,
                        'wagetype' => $record->wagetype,
                        'wage_rate' => $record->wage_rate,
                        'worked_date' => $record->worked_date,
                        'worked_hours' => $record->worked_hours,
                        'total_earned' => $record->total_earned,
                        'status' => $record->status,
                        'created_at' => $record->created_at,
                        'updated_at' => $record->updated_at,
                    ];
                }),
            ];
        })->values(); // reset keys for JSON
    
        return response()->json($grouped, 200);
    }


    public function payrollSelected($id)
    {
        $payroll = Payroll::with(['user:id,name', 'project:id,name'])
            ->findOrFail($id);
    
        return response()->json($payroll, 200);
    }
    

    public function update(Request $request, $id)
    {

        $payroll = Payroll::findOrFail($id);
        
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'user_id' => 'required|exists:users,id',
            'wagetype' => 'required|string',
            'wage_rate' => 'required|numeric',
            'worked_date' => 'required|date',
            'worked_hours' => 'required|numeric',
            'status' => 'nullable|in:Pending,Paid,Processed', 
            'total_earned' => 'required|numeric',
        ]);

        $payroll->update($validated);

        return response()->json(['message' => 'Payroll Update Successfully'], 201);
    }


    

    public function delete($id){

        $payroll = Payroll::findOrfail($id);

        $payroll->delete();

        return response()->json(['message' => 'Payroll deleted successfully'], 200);

    }


}
