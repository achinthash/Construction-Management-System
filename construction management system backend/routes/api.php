<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;

use App\Http\Controllers\EquipmentController;

use App\Http\Controllers\ChatController;

use App\Http\Controllers\NotificationController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


// user section

Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('guest')->name('register');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('guest')->name('login');
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('guest')->name('password.email');
Route::post('/reset-password', [NewPasswordController::class, 'store'])->middleware('guest')->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)->middleware(['auth', 'signed', 'throttle:6,1'])->name('verification.verify');
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware(['auth', 'throttle:6,1'])->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum')->name('logout');
Route::post('/user-update/{id}', [RegisteredUserController::class, 'update'])->middleware('auth:sanctum')->name('update');
Route::put('/user-update-password/{id}', [RegisteredUserController::class, 'update_password'])->middleware('auth:sanctum')->name('update_password');
Route::get('/user/{id}', [RegisteredUserController::class, 'user'])->middleware('auth:sanctum')->name('user');
Route::get('/users-all', [RegisteredUserController::class, 'usersList'])->middleware('auth:sanctum')->name('usersList');
Route::delete('/delete-user/{id}', [RegisteredUserController::class, 'deleteUser'])->middleware('auth:sanctum','checkAbilities:delete-users')->name('deleteUser');



// equipments section

Route::post('/equipment-store', [EquipmentController::class, 'store'])->middleware('auth:sanctum')->name('store');
Route::post('/equipment-update/{id}', [EquipmentController::class, 'update'])->middleware('auth:sanctum')->name('update');
Route::get('/equipment-all', [EquipmentController::class, 'equipmentList'])->middleware('auth:sanctum')->name('equipmentList');
Route::get('/equipment/{id}', [EquipmentController::class, 'equipment'])->middleware('auth:sanctum')->name('equipment');
Route::delete('/delete-equipment/{id}', [EquipmentController::class, 'deleteEquipment'])->middleware('auth:sanctum')->name('deleteEquipment');



// chats section

Route::post('/new-chat', [ChatController::class, 'CreateChat'])->middleware('auth:sanctum');
Route::post('/new-message', [ChatController::class, 'newMessage'])->middleware('auth:sanctum');
Route::get('/chat-head/{chat_id}', [ChatController::class, 'chatHead'])->middleware('auth:sanctum');
Route::get('/private-messages/{chat_id}', [ChatController::class, 'privateMessages'])->middleware('auth:sanctum');
Route::get('/messages/{user_id}', [ChatController::class, 'privateChatList'])->middleware('auth:sanctum'); 
Route::put('/update-message-status', [ChatController::class, 'updateReceiverStatus'])->middleware('auth:sanctum'); 
Route::get('/groups/{userId}', [ChatController::class, 'groupLists'])->middleware('auth:sanctum'); 

// notification 

Route::post('/new-notification', [NotificationController::class, 'store'])->middleware('auth:sanctum');
Route::put('/update-notification-status/{id}', [NotificationController::class, 'statusUpdate'])->middleware('auth:sanctum');

Route::get('/notifications/{user_id}', [NotificationController::class, 'notificationsLists'])->middleware('auth:sanctum'); 
