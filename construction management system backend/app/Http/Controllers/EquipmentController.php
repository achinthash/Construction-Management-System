<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipment;
use Illuminate\Support\Facades\Storage;


class EquipmentController extends Controller
{
    //

    public function store(Request $request){

        $request->validate([
            'serial_number' => ['required', 'string', 'max:255','unique:'.Equipment::class],
            'category' => ['required', 'string', 'max:25'],
            'model' => ['required', 'string', 'max:25'],
            'name' => ['required', 'string', 'max:25'],
            'status' => ['required', 'string', 'max:25'],
            'condition_level' => ['required', 'string', 'max:25'],
        
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'purchase_date' => ['nullable', 'date'], 
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'], 
        ]);

        $equipment_picture_path = null;

        if($request->hasFile('image')){
            $equipment_picture_path = $request->file('image')->store('equipment pictures', 'public');
        }

        $equipment = Equipment::create([
          'serial_number' => $request->serial_number,
          'category' => $request->category,
          'model' => $request->model,
          'name' => $request->name,
          'status' => $request->status,
          'condition_level' => $request->condition_level,

          'purchase_price' => $request->purchase_price,
          'purchase_date' => $request->purchase_date,
          'image' => $equipment_picture_path,
        ]);

        return response()->json(['message'=> 'Equipment created successfull!']);
      
        

    }

    public function update(Request $request, $id){


        $equipment = equipment::findOrFail($id);

        $validated = $request->validate([
            'serial_number' => ['required', 'string', 'max:255', 'unique:equipment,serial_number,'.$id],
            'category' => ['required', 'string', 'max:25'],
            'model' => ['required', 'string', 'max:25'],
            'name' => ['required', 'string', 'max:25'],
            'status' => ['required', 'string', 'max:25'],
            'condition_level' => ['required', 'string', 'max:25'],
        
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'purchase_date' => ['nullable', 'date'], 
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'], 
        ]);

        // Handle profile image upload
        if ($request->hasFile('image')) {
    
            if ($equipment->image) {
                Storage::disk('public')->delete($equipment->image);
            }

            $equipment_picture_path = $request->file('image')->store('equipment_pictures', 'public');
            $validated['image'] = $equipment_picture_path; 
        }
        $equipment->update($validated);

        return response()->json(['message' => 'Equipment updated successfully', 'user' => $equipment], 200);


    }

    public function equipmentList(){
        
        $equipments = Equipment::all();     
        return response()->json($equipments, 200);
    }

    public function equipment($id){

        $equipments = Equipment::findOrFail($id);
        return response()->json($equipments, 200);

    }

    public function deleteEquipment($id)
    {
        $equipments = Equipment::findOrFail($id);

        $equipments->delete(); 

        return response()->json(['message' => 'Equipment deleted successfully'], 200);
    }
}


