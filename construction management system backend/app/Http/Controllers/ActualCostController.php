<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActualCost;
use App\Models\Payroll;

class ActualCostController extends Controller
{
    //

    public function store(Request $request)
    {
        $request->validate([
            'estimation_id' => 'required|exists:estimations,id',
            'reason' => 'nullable|string|max:255',
            'cost_type' => 'required|string',
            'unit' => 'required|string',
            'quantity' => 'required|numeric',
            'unit_price' => 'required|numeric',
            'total_cost' => 'required|numeric',

            'worked_date' => 'nullable|date',
            'project_id' =>'nullable|exists:projects,id',
            'user_id' => 'nullable|numeric',
        ]);
    
        // Check if a record with this estimation_id already exists
        $actualCost = ActualCost::where('estimation_id', $request->estimation_id)->first();
    
        if ($actualCost) {
            // Update the existing record
            $actualCost->update($request->all());
            return response()->json(['message' => 'Actual Cost updated successfully'], 200);
        } else {
            // Create a new record
            ActualCost::create($request->all());

            if ($request->cost_type === 'Labor Cost') {
                Payroll::create([
                    'project_id' => $request->project_id,
                    'user_id' => $request->user_id,
                    'wagetype' => $request->unit,
                    'wage_rate' => $request->unit_price,
                    'worked_date' => $request->worked_date,
                    'worked_hours' => $request->quantity,
                    'total_earned' => $request->total_cost,
                    'status' => 'Pending',
                ]);
            }
            return response()->json(['message' => 'Actual Cost created successfully'], 201);
        }
    }

    
    public function actualCostSelected($id){

        $actualCost = ActualCost::findOrfail($id);

        return response()->json($actualCost);
    }


    public function update(Request $request, $id){

        $actualCost = ActualCost::findOrfail($id);

        $validated = $request->validate([
            'estimation_id' => 'required|exists:estimations,id',
            'reason' => 'nullable|string|max:255',
            'cost_type' => 'required|string',
            'unit' => 'required|string',
            'quantity' => 'required|numeric',
            'unit_price' => 'required|numeric',
            'total_cost' => 'required|numeric',
        ]);

        $actualCost->update($validated);

        return response()->json(['message' => 'Actual Cost Update Successfully'], 201);
    }

    public function delete($id){

        $actualCost = ActualCost::findOrfail($id);
        $actualCost->delete();
        return response()->json(['message' => 'Actual Cost deleted successfully'], 200);
    }



   


    

}


