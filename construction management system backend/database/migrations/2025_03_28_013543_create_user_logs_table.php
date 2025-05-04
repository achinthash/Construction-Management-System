<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_logs', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('task_id');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('user_id');

            $table->string('title');
            $table->text('description')->nullable();
            $table->date('date');
            $table->string('status')->default('pending');
            
            // $table->decimal('hourly_rate', 10, 2)->nullable();
            // $table->decimal('hours_worked', 10, 2)->nullable();
            // $table->decimal('total_cost', 15, 2)->nullable();

            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();  
            $table->string('work_quality')->nullable();

            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');

            $table->timestamps();
            $table->softDeletes();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_logs');
    }
};
