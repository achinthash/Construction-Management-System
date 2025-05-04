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
        Schema::create('estimations', function (Blueprint $table) {
            $table->id();


            $table->unsignedBigInteger('project_id'); 
            $table->unsignedBigInteger('task_id');  
            $table->string('title');                  
            $table->text('description')->nullable();  
            $table->string('cost_type');             
            $table->string('unit');                 
            $table->integer('quantity');       
            $table->decimal('unit_price', 10, 2);   
            $table->decimal('total_cost', 12, 2);   

            $table->unsignedBigInteger('referenced_id')->nullable();

            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade')->onUpdate('cascade');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estimations');
    }
};
