<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use App\Mail\UserRegistered;
use Illuminate\Validation\Rule;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:25'],
            'role' => ['required', 'string', 'max:25'],
            'position' => ['nullable', 'string', 'max:25'],
            'profile_picture' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:5048'],
            'nic' => ['nullable', 'string', 'max:25'],
          
        ]);

        $profile_picture_path = null;

        if($request->hasFile('profile_picture')){
            $profile_picture_path = $request->file('profile_picture')->store('profile_pictures', 'public');
        }
      
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number'  => $request->phone_number,
            'address'  => $request->address,
            'status' => $request->status,
            'role' => $request->role,
            'profile_picture'  => $profile_picture_path,
            'nic'  => $request->nic,
            'position'  => $request->position,
            
        ]);

        $password = $request->password;

        // event(new Registered($user));

        // Auth::login($user);

      //  Mail::to($user->email)->send(new UserRegistered($user,$password));   // for later 

        // abilities based on roles
        $abilities = [];

        switch ($request->role) {
            case 'admin':
                $abilities = ['insert-user','edit-user','delete-user', 'view-user']; // Admin has full access
                break;
            case 'contractor':
                $abilities = ['add-data','view-date'];
                break;
            case 'client':
                $abilities = ['view-data'];
                break;
            case 'labor':
                $abilities = ['view-datatus'];
                break;
            case 'consultant':
                $abilities = ['view-data'];
                break;
        }
        $token = $user->createToken('auth_token',$abilities)->plainTextToken;

      //  $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }



    public function update(Request $request, $id){

        $user = User::findOrFail($id); 

        $validated =   $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:25'],
            'profile_picture' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif', 'max:5048'],
            'nic' => ['nullable', 'string', 'max:25'],

            'role' => ['required', 'string', 'max:25'],
            'position' => ['nullable', 'string', 'max:25'],
        ]);

           // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
        
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $profile_picture_path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $validated['profile_picture'] = $profile_picture_path; 
        }
        $user->update($validated);

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }


    public function update_password(Request $request, $id){

        $request->validate([
            'current_password' => 'required',
            'new_password' => ['required',  'confirmed' , 'min:8'],
        ]);

        $user = User::findOrFail($id);
        
          // Check if current password is correct
          if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);
        
        return response()->json(['message' => 'Password changed successfully!'], 200);
    }


    public function usersList(){
     
        $users = User::all();     
        return response()->json($users, 200);
                
    }


    public function user($id){

        $user = User::findOrFail($id);
        return response()->json($user, 200);
    }


    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        $user->delete(); 

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
