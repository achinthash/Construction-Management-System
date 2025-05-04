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
        Schema::create('bills', function (Blueprint $table) {
            $table->id();

            $table->string('title');
            $table->unsignedBigInteger('project_id');
            $table->string('bill_type');
            $table->enum('status', ['draft', 'pending', 'paid', 'overdue'])->default('draft');
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->unsignedBigInteger('paid_by');
            $table->unsignedBigInteger('paid_to');
            $table->text('notes')->nullable();
            $table->decimal('total', 12, 2)->default(0);


            $table->timestamps();
            $table->softDeletes();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('paid_by')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('paid_to')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bills');
    }
};
