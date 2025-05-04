<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bill;
use App\Models\BillItems;

class BillController extends Controller
{
    //

    public function store(Request $request){

        $validated =  $request->validate([

            'title'        => 'required|string|max:255',
            'project_id'   => 'required|exists:projects,id',
            'bill_type'    => 'required|string|max:255',
            'status'       => 'required|in:draft,pending,paid,overdue',
            'tax'          => 'nullable|numeric',
            'discount'     => 'nullable|numeric',
            'subtotal'     => 'required|numeric',
            'paid_by'      => 'required|exists:users,id',
            'paid_to'      => 'required|exists:users,id',
            'notes'        => 'nullable|string',
            'total'        => 'required|numeric',
            

            'items'                 => 'required|array|min:1',
            'items.*.title'      => 'required|string|',
            'items.*.quantity'      => 'required|numeric|min:1', 
            'items.*.unit_price'    => 'required|numeric|min:0',
            'items.*.total'         => 'required|numeric|min:0',

        ]);

        $bill = Bill::create([
            'title' => $validated['title'],
            'project_id' => $validated['project_id'],
            'bill_type'  => $validated['bill_type'],
            'status'     => $validated['status'],
            'tax'        => $validated['tax'] ?? 0,
            'discount'   => $validated['discount'] ?? 0,
            'subtotal'   => $validated['subtotal'],
            'paid_by'    => $validated['paid_by'],
            'paid_to'    => $validated['paid_to'],
            'notes'      => $validated['notes'] ?? null,
            'total'   => $validated['total'],
        ]);


        foreach($validated['items'] as $item){
            BillItems::create([
                'bill_id'     => $bill->id,
                'title'       => $item['title'],
                'quantity'    => $item['quantity'],
                'unit_price'  => $item['unit_price'],
                'total'       => $item['total'],
            ]);
        }

        return response()->json([ 'message' => 'Bill and items created successfully',], 201);
    }


    public function billsProjects($project_id)
    {
        $bills = Bill::with('items')->where('project_id', $project_id)->get();
    
        return response()->json($bills);
    }


    public function billselected($id)
    {
        $bills = Bill::with('items','project','payee')->where('id', $id)->first();
    
        return response()->json($bills);
    }

    public function deleteBill($id){

        $bills = Bill::findOrfail($id);
        $bills->delete();
        return response()->json(['message' => 'Bill deleted successfully'], 200);
    }

    public function deleteBillItem($id){

        $bills = BillItems::findOrfail($id);
        $bills->delete();
        return response()->json(['message' => 'Bill Item deleted successfully'], 200);
    }


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'bill_type' => 'required|string|max:100',
            'status' => 'required|in:draft,pending,paid,overdue', 
            'tax' => 'nullable|numeric',
            'discount' => 'nullable|numeric',
            'subtotal' => 'required|numeric',
            'paid_by' => 'required|exists:users,id',
            'paid_to' => 'required|exists:users,id',
            'notes' => 'nullable|string',
            'total' => 'required|numeric',
        ]);

        $bill = Bill::findOrFail($id);
        $bill->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Record updated successfully!',
        ], 200);
    }


    public function updateBillItem(Request $request, $id)
    {
        $validated = $request->validate([
            'bill_id' => 'required|exists:bills,id', 
            'title' => 'required|string|max:255',
            'quantity' => 'required|numeric',
            'unit_price' => 'required|numeric',
            'total' => 'required|numeric',
        ]);

        $billItem = BillItems::findOrFail($id);
        $billItem->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bill item updated successfully!',
        ], 200);
    }


    public function billItemSelected($id){
        $bills = BillItems::findOrfail($id);
    
        return response()->json($bills);
    }
    
}
