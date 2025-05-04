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
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectImageController;
use App\Http\Controllers\ProjectDocumentController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserLogController;
use App\Http\Controllers\EquipmentLogController;
use App\Http\Controllers\EstimationController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\QualityControlController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ActualCostController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\BillController;


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


Route::get('/static-info', function () {
    return [
        'system_name' => 'ConstructionPro',
        'company_name' => 'Achintha Constructions',
    ];
});




// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });


// user section

Route::middleware(['guest'])->group(function (){
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('/reset-password', [NewPasswordController::class, 'store']);   
});

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)->middleware(['auth', 'signed', 'throttle:6,1'])->name('verification.verify');
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware(['auth', 'throttle:6,1'])->name('verification.send');



Route::middleware(['auth:sanctum'])->group(function (){

    // users 
    Route::post('/register', [RegisteredUserController::class, 'store'])->middleware('checkAbilities:admin-access');
    Route::delete('/delete-user/{id}', [RegisteredUserController::class, 'deleteUser'])->middleware('checkAbilities:admin-access');

    Route::get('/users-all', [RegisteredUserController::class, 'usersList'])->middleware('checkAbilities:admin-access,contractor-access');

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,labor-access,consultant-access'])->group(function () {
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
        Route::post('/user-update/{id}', [RegisteredUserController::class, 'update']);
        Route::get('/user/{id}', [RegisteredUserController::class, 'user']);
        Route::put('/user-update-password/{id}', [RegisteredUserController::class, 'update_password']);
    });


    // equipments
    Route::post('/equipment-store', [EquipmentController::class, 'store'])->middleware('checkAbilities:admin-access');
    Route::post('/equipment-update/{id}', [EquipmentController::class, 'update'])->middleware('checkAbilities:admin-access');
    Route::delete('/delete-equipment/{id}', [EquipmentController::class, 'deleteEquipment'])->middleware('checkAbilities:admin-access');

    Route::get('/equipment-all', [EquipmentController::class, 'equipmentList'])->middleware('checkAbilities:admin-access,contractor-access');
    Route::get('/equipment/{id}', [EquipmentController::class, 'equipment'])->middleware('checkAbilities:admin-access,contractor-access');

    
    // notification 
    Route::post('/new-notification', [NotificationController::class, 'store'])->middleware('checkAbilities:admin-access');

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,labor-access,consultant-access'])->group(function () {
        Route::put('/update-notification-status/{id}', [NotificationController::class, 'statusUpdate']);      
        Route::get('/notifications/{user_id}', [NotificationController::class, 'notificationsLists']);     
    });

    // projects
    Route::post('/new-project', [ProjectController::class, 'store'])->middleware('checkAbilities:admin-access');
    Route::delete('/delete-project/{id}', [ProjectController::class, 'deleteProject'])->middleware('checkAbilities:admin-access');
    Route::put('/update-project/{id}', [ProjectController::class, 'update'])->middleware('checkAbilities:admin-access');
    Route::get('/projects-all', [ProjectController::class, 'ListProjects'])->middleware('checkAbilities:admin-access');

    Route::post('/new-user-project', [ProjectController::class, 'newUserProject'])->middleware('checkAbilities:admin-access,contractor-access');

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/projects/{user_id}', [ProjectController::class, 'projects']);
        Route::get('/access-projects/{user_id}/{project_id}', [ProjectController::class, 'accessProject']);
        Route::get('/project-users/{project_id}', [ProjectController::class, 'ProjectUsers']);
        Route::get('/project/{id}', [ProjectController::class, 'selectedProject']);
    });


    // images 
    Route::post('/new-image', [ProjectImageController::class, 'newImage'])->middleware('checkAbilities:admin-access,contractor-access');
    Route::delete('/delete-image/{id}', [ProjectImageController::class, 'deleteImage'])->middleware('checkAbilities:admin-access,contractor-access');

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/image-albums/{project_id}', [ProjectImageController::class, 'imagesAlbums']);
        Route::get('/images/{project_id}/{album_name}', [ProjectImageController::class, 'getImagesByAlbum']);
        Route::get('/image/{id}', [ProjectImageController::class, 'image']);
        Route::get('/images-type/{project_id}/{type}', [ProjectImageController::class, 'imagesByType']);
        Route::get('/images-type-item/{project_id}/{type}/{item}', [ProjectImageController::class, 'imagesByTypeItem']);
        Route::get('/images-task/{project_id}/{task_id}', [ProjectImageController::class, 'imagesByTask']);
    });


    // documents
    Route::delete('/delete-document/{id}', [ProjectDocumentController::class, 'deleteDocument'])->middleware('checkAbilities:admin-access,contractor-access');
    Route::post('/new-document', [ProjectDocumentController::class, 'newDocument'])->middleware('checkAbilities:admin-access,contractor-access');

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::post('/new-single-document', [ProjectDocumentController::class, 'newDocumentSingle']);
        Route::get('/folders/{project_id}', [ProjectDocumentController::class, 'folders']);
        Route::get('/files/{project_id}/{folder_name}', [ProjectDocumentController::class, 'files']);
        Route::get('/files-task/{project_id}/{task_id}', [ProjectDocumentController::class, 'filesTasks']);
        Route::get('/files-type-item/{project_id}/{type}/{item}', [ProjectDocumentController::class, 'documentsByTypeItem']);
    });


    // tasks
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-task', [TaskController::class, 'store']);
        Route::delete('/delete-task/{id}', [TaskController::class, 'delete']);
        Route::put('/update-task/{id}', [TaskController::class, 'update']);
        Route::put('/update-task-date/{id}', [TaskController::class, 'updateTaskDate']);
        Route::post('/new-task-date', [TaskController::class, 'storeTaskDate']);
        Route::delete('/delete-task-date/{id}', [TaskController::class, 'deleteTaskDate']);
        Route::post('/new-daily-log-issues', [TaskController::class, 'DalityLogIssuesStore']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/tasks-project/{project_id}', [TaskController::class, 'tasks']);
        Route::get('/task/{id}', [TaskController::class, 'task']); 
        Route::get('/tasksDates/{project_id}', [TaskController::class, 'tasksDates']); 
        Route::get('/tasksWithDates/{id}', [TaskController::class, 'tasksWithDates']); 
        Route::get('/work/{project_id}/{date}', [TaskController::class, 'work']); 
        Route::get('/work-selected/{id}', [TaskController::class, 'workSelected']); 
        Route::get('/tasks-dates-project/{project_id}', [TaskController::class, 'tasksWithDatesProject']); 
        Route::get('/tasks-logs-projects/{project_id}', [TaskController::class, 'tasksLogsProjects']); 
        Route::get('/tasks-logs-tasks/{project_id}/{task_id}', [TaskController::class, 'tasksLogsTasks']); 
        Route::get('/daily-log-date/{id}', [TaskController::class, 'dailyLogissuesWork']); 
        Route::get('/daily-log-date-selected/{id}', [TaskController::class, 'taskDateSelected']); 
    });


    // user logs
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-userlog', [UserLogController::class, 'store']);
        Route::put('/update-user-logs/{id}', [UserLogController::class, 'update']);
        Route::delete('/delete-user-log/{id}', [UserLogController::class, 'delete']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/user-logs-dates', [UserLogController::class, 'userLogDates']); 
        Route::get('/user-logs-dates/{user_id}', [UserLogController::class, 'userLogDatesUser']); 
        Route::get('/user-logs/{task_id}', [UserLogController::class, 'userLogsForByTask']); 
        Route::get('/user-logs-projects/{project_id}', [UserLogController::class, 'userLogsForByProjects']);
        Route::get('/user-logs-work-date/{task_id}/{date}', [UserLogController::class, 'userLogByDate']); 
        Route::get('/user-logs-selected/{id}', [UserLogController::class, 'userLogSelected']);
        Route::get('/user-logs-user-project/{project_id}/{user_id}', [UserLogController::class, 'UseruserLogs']); 
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,labor-access,consultant-access'])->group(function () {
        Route::get('/my-tasks/{user_id}', [UserLogController::class, 'myTasks']);
        Route::get('/my-logs-projects/{user_id}', [UserLogController::class, 'myTasksGrouped']);
    });

   

    // equipment log
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-equipmentlog', [EquipmentLogController::class, 'store']);
        Route::delete('/delete-equipment-log/{id}', [EquipmentLogController::class, 'delete']);
        Route::put('/update-equipment-logs/{id}', [EquipmentLogController::class, 'update']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/equipment-logs-dates', [EquipmentLogController::class, 'equipmentLogDates']); 
        Route::get('/equipment-logs-dates/{equipment_id}', [EquipmentLogController::class, 'equipmentLogDatesUser']);
        Route::get('/equipment-logs/{task_id}', [EquipmentLogController::class, 'equipmentLogsForByTask']); 
        Route::get('/equipment-logs-projects/{project_id}', [EquipmentLogController::class, 'equipmentLogsForByProjet']);
        Route::get('/equipment-logs-work-date/{task_id}/{date}', [EquipmentLogController::class, 'EquipmentLog']);
        Route::get('/equipment-logs-all-projects/{equipment_id}', [EquipmentLogController::class, 'equipmentLogGrouped']);
        Route::get('/equipment-logs-selected/{id}', [EquipmentLogController::class, 'equipentLogSelected']);
        Route::get('/equipment-logs-equipments-project/{project_id}/{equipment_id}', [EquipmentLogController::class, 'equipentEquipmentLog']);
    });


    // estimations
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-estimation', [EstimationController::class, 'store']);
        Route::put('/update-estimation/{id}', [EstimationController::class, 'update']); 
        Route::delete('/delete-estimation/{id}', [EstimationController::class, 'delete']); 
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/estimations/{project_id}', [EstimationController::class, 'estimations']); 
        Route::get('/estimation-summary/{project_id}', [EstimationController::class, 'estimationSummary']);
        Route::get('/estimation-tasks/{task_id}', [EstimationController::class, 'estimationsByTask']); 
        Route::get('/estimation-actual-selected-edit/{id}', [EstimationController::class, 'estVsActSelectedEdit']); 
        Route::get('/estimation-actual-selected/{id}', [EstimationController::class, 'estwithactualSelected']); 
        Route::get('/estimation-taskwise/{project_id}', [EstimationController::class, 'taskwise']); 
        Route::get('/estimation-selected/{id}', [EstimationController::class, 'show']); 
    });

    // actual cost
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-actual-cost', [ActualCostController::class, 'store']);
        Route::put('/update-actual-cost/{id}', [ActualCostController::class, 'update']);
        Route::delete('/delete-actual-cost/{id}', [ActualCostController::class, 'delete']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/estimation-with-actual-task/{task_id}', [EstimationController::class, 'estwithactualTask']);
        Route::get('/estimation-with-actual-project/{project_id}', [EstimationController::class, 'estwithactualProject']);
        Route::get('/actualcost-summary/{project_id}', [EstimationController::class, 'actualcostSummary']);
        Route::get('/material-quantity/{project_id}', [EstimationController::class, 'materialQuantity']);
        Route::get('/actual-cost-selected/{id}', [ActualCostController::class, 'actualCostSelected']);
    });


    // purchase orders 
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-purchase-order', [PurchaseOrderController::class, 'store']);
        Route::put('/update-purchase-orders/{id}', [PurchaseOrderController::class, 'update']);
        Route::put('/update-purchase-orders-cost-item/{id}', [PurchaseOrderController::class, 'poCostItemupdate']);
        Route::delete('/delete-purchase-order/{id}', [PurchaseOrderController::class, 'deletePurchaseOrder']);
        Route::delete('/delete-purchase-order-cost/{id}', [PurchaseOrderController::class, 'deletePOCost']);
    });


    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/purchase-orders/{project_id}', [PurchaseOrderController::class, 'purchaseOrders']); 
        Route::get('/purchase-orders-tasks/{task_id}', [PurchaseOrderController::class, 'purchaseOrdersByTask']);
        Route::get('/purchase-orders-work-date/{task_id}/{date}', [PurchaseOrderController::class, 'purchaseOrderLog']);
        Route::get('/purchase-order-selected/{id}', [PurchaseOrderController::class, 'purchaseOrdersSelected']);
        Route::get('/po-cost-item-selected/{id}', [PurchaseOrderController::class, 'poCostItemSelected']);
    });
   

    //  qualit controll

    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-quality-control', [QualityControlController::class, 'store']);
        Route::put('/update-quality-controls/{id}', [QualityControlController::class, 'update']);
        Route::delete('/delete-quality-control/{id}', [QualityControlController::class, 'delete']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/quality-controls-projects/{project_id}', [QualityControlController::class, 'qulityControlsByProject']); 
        Route::get('/quality-controls-tasks/{task_id}', [QualityControlController::class, 'qulityControlsByTask']); 
        Route::get('/quality-controls-work-date/{task_id}/{date}', [QualityControlController::class, 'qualityControlWork']);
        Route::get('/quality-controls-selected/{id}', [QualityControlController::class, 'qualityControlSelected']);
    });


    // meterials
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-material', [MaterialController::class, 'store']);
        Route::put('/update-material-logs/{id}', [MaterialController::class, 'update']);
        Route::delete('/delete-material-log/{id}', [MaterialController::class, 'delete']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/materials-tasks/{task_id}', [MaterialController::class, 'materialsByTasks']); 
        Route::get('/materials-project/{project_id}', [MaterialController::class, 'materialsByProject']);
        Route::get('/material-logs-work-date/{task_id}/{date}', [MaterialController::class, 'MaterialLog']); 
        Route::get('/material-logs-selected/{id}', [MaterialController::class, 'materialLogSelected']); 
    });

    
    // PayrollController 
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-payroll', [PayrollController::class, 'store']);
        Route::put('/update-payroll/{id}', [PayrollController::class, 'update']); 
        Route::delete('/delete-payroll/{id}', [PayrollController::class, 'delete']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/payroll-project/{project_id}', [PayrollController::class, 'payrollProjectWise']);
        Route::get('/payroll-summary/{project_id}', [PayrollController::class, 'payrollProjectSummary']);
        Route::get('/payroll-selected/{id}', [PayrollController::class, 'payrollSelected']); 
    });

    Route::get('/payroll-users/{user_id}', [PayrollController::class, 'payrollUserWise'])->middleware(['checkAbilities:admin-access,contractor-access,client-access,labor-access,consultant-access']);

    
    // BillController
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-bill', [BillController::class, 'store']);
        Route::delete('/delete-bill/{id}', [BillController::class, 'deleteBill']);
        Route::delete('/delete-bill-item/{id}', [BillController::class, 'deleteBillItem']);
        Route::put('/update-bill/{id}', [BillController::class, 'update']);
        Route::put('/update-bill-item/{id}', [BillController::class, 'updateBillItem']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/bills-project/{projectId}', [BillController::class, 'billsProjects']);
        Route::get('/bill-selected/{id}', [BillController::class, 'billselected']);
        Route::get('/bill-item-selected/{id}', [BillController::class, 'billItemSelected']);
    });



    // AnnouncementController
    Route::middleware(['checkAbilities:admin-access,contractor-access'])->group(function () {
        Route::post('/new-announcement', [AnnouncementController::class, 'store']);
        Route::put('/update-announcement/{id}', [AnnouncementController::class, 'update']);
        Route::delete('/delete-announcement/{id}', [AnnouncementController::class, 'delete']);
    });

    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access'])->group(function () {
        Route::get('/announcement-all', [AnnouncementController::class, 'announcementAll']);
        Route::get('/announcements-project/{projectId}', [AnnouncementController::class, 'announcementsProject']);
        Route::get('/announcement-selected/{id}', [AnnouncementController::class, 'selectedAnnouncement']);
    });


    // chats section
    Route::middleware(['checkAbilities:admin-access,contractor-access,client-access,consultant-access,labor-access'])->group(function () {
        Route::post('/new-chat', [ChatController::class, 'CreateChat']);
        Route::post('/new-message', [ChatController::class, 'newMessage']);
        Route::get('/chat-head/{chat_id}', [ChatController::class, 'chatHead']);
        Route::get('/private-messages/{chat_id}', [ChatController::class, 'privateMessages']);
        Route::get('/messages/{user_id}', [ChatController::class, 'privateChatList']);
        Route::put('/update-message-status', [ChatController::class, 'updateReceiverStatus']);
        Route::get('/groups/{userId}', [ChatController::class, 'groupLists']);
    });

});