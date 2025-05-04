<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderCostItem;
use App\Models\Estimation;


class PurchaseOrderController extends Controller
{
    //

    public function store(Request $request)
    {
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'task_id' => 'required|exists:tasks,id',
            'title' => 'required|string|max:255',
            'status' => 'required|in:Pending,Approved,Rejected,Completed',
            'delivery_date' => 'required|date',
            'created_by' => 'required|exists:users,id',
            'supplier_name' => 'required|string|max:255',
            'supplier_phone' => 'required|string|max:20',

            'cost_items' => 'nullable|array',

            'cost_items.*.item_name' => 'required|string|max:255',
            'cost_items.*.quantity' => 'required|numeric',
            'cost_items.*.unit' => 'required|string|max:20',
            'cost_items.*.unit_price' => 'required|numeric',
            'cost_items.*.total_amount' => 'required|numeric',

        ]);

          $purchaseOrder = PurchaseOrder::create($request->only([
                'project_id',
                'task_id',
                'title',
                'status',
                'delivery_date',
                'created_by',
                'supplier_name',
                'supplier_phone',
            ]));


        if(!empty($request->cost_items)){
            
            foreach($request->cost_items as $cost_items){


             $purchaseOrderCostItem =   PurchaseOrderCostItem::create([
                    'purchase_order_id' => $purchaseOrder->id,
                    'item_name' =>  $cost_items['item_name'] ,
                    'quantity' => $cost_items['quantity'] ,
                    'unit' =>  $cost_items['unit'] ,
                    'unit_price' =>  $cost_items['unit_price'] ,
                    'total_amount' =>  $cost_items['total_amount'] ,
                ]);

             

                Estimation::create([
                    'project_id' => $request->project_id,
                    'task_id' => $request->task_id,
                    
                    'title' =>$cost_items['item_name']  . ' - Purchase Order Cost',
                    'cost_type' => 'Purchase Order Cost',
                    'unit' =>  $cost_items['unit'] ,
                    'quantity' => $cost_items['quantity'] ,
                    'unit_price' => $cost_items['unit_price'] ,
                    'total_cost' => $cost_items['total_amount'] ,
        
                    'referenced_id' => $purchaseOrderCostItem->id, 
                ]);
                

                

            }

        }

        return response()->json([
            'message' => 'Purchase Order created successfully',
            'data' => $purchaseOrder
        ], 201);
    }






    public function purchaseOrders($Project_id)
    {
        $purchaseOrders = PurchaseOrder::with('PurchaseOrderCostItem')
            ->where('project_id', $Project_id)
            ->get()


            ->map(function ($purchaseOrder){

                $totalCost = $purchaseOrder->PurchaseOrderCostItem->sum('total_amount');
                
                $purchaseOrder->total_cost = $totalCost;

                return $purchaseOrder;
            });
            
        return response()->json($purchaseOrders);
    }

    // for task 

    public function purchaseOrdersByTask($task_id)
    {
        $purchaseOrders = PurchaseOrder::with('PurchaseOrderCostItem')
            ->where('task_id', $task_id)
            ->get()


            ->map(function ($purchaseOrder){

                $totalCost = $purchaseOrder->PurchaseOrderCostItem->sum('total_amount');
                
                $purchaseOrder->total_cost = $totalCost;

                return $purchaseOrder;
            });
            
        return response()->json($purchaseOrders);
    }



    public function purchaseOrderLog($task_id, $date)
    {
        $purchaseOrders = PurchaseOrder::with([
            'costItems.estimation.actualCost'  // This chains estimation → actualCost
        ])
        ->where('task_id', $task_id)
        ->where('delivery_date', $date)
        ->get();
    
        return response()->json($purchaseOrders);
    }
    


    public function update(Request $request, $id)
    {
        $validated =  $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'title' => 'required|string|max:255',
            'status' => 'required|in:Pending,Approved,Rejected,Completed',
            'delivery_date' => 'required|date',
            'created_by' => 'required|exists:users,id',
            'supplier_name' => 'required|string|max:255',
            'supplier_phone' => 'required|string|max:20',
        ]);

        $purchaseOrder = PurchaseOrder::findOrFail($id);
    
        $purchaseOrder->update($validated);
    
        return response()->json([
            'succrss' => true,
            'message' => 'Purchase Order updated successfully!', ], 200);
    }
    

    // update purchase order cost item during work

    // public function poCostItemupdateWork(Request $request,$id){

    //     $validated = $request->validate([
    //         'item_name' => 'required|string|max:255',
    //         'quantity' => 'required|numeric',
    //         'unit' => 'required|string|max:20',
    //         'unit_price' => 'required|numeric',
    //         'total_amount' => 'required|numeric',
    //     ]);

    //     $pocostItem = PurchaseOrderCostItem::findOrfail($id);

    //     $pocostItem->update($validated);
    
    //     return response()->json([
    //         'succrss' => true,
    //         'message' => 'Purchase Order cost item updated successfully!', ], 200);

        
           
    // }

    // normal update po cost item

    public function poCostItemupdate(Request $request,$id){

        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'quantity' => 'required|numeric',
            'unit' => 'required|string|max:20',
            'unit_price' => 'required|numeric',
            'total_amount' => 'required|numeric',
        ]);

        $pocostItem = PurchaseOrderCostItem::findOrfail($id);

        $pocostItem->update($validated);
    
        return response()->json([
        'succrss' => true,
        'message' => 'Purchase Order cost item updated successfully!', ], 200);

    }


    public function purchaseOrdersSelected($id){

        $purchaseOrders = PurchaseOrder::with('costItems','project', 'task','creator')->where('id',$id)->first();
    
        return response()->json($purchaseOrders);
    }

    public function poCostItemSelected($id){

        $poCostItem = PurchaseOrderCostItem::findOrfail($id);
    
        return response()->json($poCostItem);
    }




    public function deletePurchaseOrder($id){

        $purchaseOrder = PurchaseOrder::findOrfail($id);

        $purchaseOrder->delete();

        return response()->json(['message' => 'Purchase Order deleted successfully'], 200);

    }


    public function deletePOCost($id){

        $poCostItem = PurchaseOrderCostItem::findOrfail($id);

        $poCostItem->delete();

        return response()->json(['message' => 'Purchase Order cost item deleted successfully'], 200);

    }
    
}
