<?php


namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UserLog;
use App\Models\Notification;
use Carbon\Carbon;
use App\Events\NotificationSent;

class SendUserLogReminders extends Command
{
    protected $signature = 'reminders:userlogs';

    protected $description = 'Send reminders to users about tomorrow\'s user logs';

    public function handle()
    {

        \Log::info('SendUserLogReminders is running at: ' . Carbon::now()->toTimeString());

        
         // Get today's date
         $today = Carbon::today()->toDateString();

         // Fetch the user logs for today
         $userLogs = UserLog::where('date', $today)->get();

        foreach ($userLogs as $log) {
            // Create notification for the user log reminder
            $notification = Notification::create([
                'type' => 'Reminder',
                'title' => 'Work Reminder',
                'description' => "You have a scheduled task tomorrow: {$log->title}",
                'user_id' => $log->user_id,
                'is_read' => false,
                'referenced_id' => $log->id,
            ]);

            \Log::info('SendUserLogReminders is running');

            // Broadcast notification for real-time updates
            broadcast(new NotificationSent($notification))->toOthers();
        }

        $this->info('User log reminders sent!');
    }
}
