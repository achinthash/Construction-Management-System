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
        Schema::create('actual_costs', function (Blueprint $table) {
            $table->id();
    
            $table->unsignedBigInteger('estimation_id'); 

            $table->text('reason')->nullable();  
            $table->string('cost_type');             
            $table->string('unit');                 
            $table->integer('quantity');       
            $table->decimal('unit_price', 10, 2);   
            $table->decimal('total_cost', 12, 2);   

            $table->foreign('estimation_id')->references('id')->on('estimations')->onDelete('cascade')->onUpdate('cascade');


            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actual_costs');
    }
};
