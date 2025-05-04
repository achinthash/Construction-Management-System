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
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();

            $table->string('serial_number')->unique();
            $table->string('category');
            $table->string('model');

            $table->string('name');
            $table->string('status');
            $table->string('condition_level');

            $table->string('purchase_price')->nullable();
            $table->date('purchase_date')->nullable();
            $table->string('image')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment');
    }
};



