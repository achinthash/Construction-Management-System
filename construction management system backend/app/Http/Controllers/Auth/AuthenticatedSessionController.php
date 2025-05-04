<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

       // $request->session()->regenerate();

       $user = Auth::user();

         // abilities based on roles
         $abilities = [];

         switch ($user->role) {
                case 'admin':
                    $abilities = ['admin-access']; 
                    break;
                case 'contractor':
                    $abilities = ['contractor-access'];
                    break;
                case 'client':
                    $abilities = ['client-access'];
                    break;
                case 'labor':
                    $abilities = ['labor-access'];
                    break;
                case 'consultant':
                    $abilities = ['consultant-access'];
                    break;
         }
         $token = $user->createToken('auth_token',$abilities)->plainTextToken;
      // $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user , 'token' => $token]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
      //  Auth::guard('web')->logout();

      //  $request->session()->invalidate();

      //  $request->session()->regenerateToken();

         $request->user()->tokens()->delete();


        return response()->json(['message' => 'Logged out successfully']);
    }
}
