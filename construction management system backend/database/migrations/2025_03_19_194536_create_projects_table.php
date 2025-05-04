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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('type');
            $table->string('description')->nullable();
            $table->string('status');
            $table->text('location')->nullable();
            $table->decimal('progress', 5, 2)->nullable();

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            $table->decimal('budget', 10, 2)->nullable();

            $table->timestamps();
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};




// id, name, type, description, status, start date, end date, location, progress , buddject
// project requirements- (project_id, type requirement)
// project consultants - (project_id, consultant_id)
// project stakeholders-  (project_id, client_id)
// project contractors- (project_id, contractor_id)
// project images
// id , project id ,   type, , description (null), image name, file_path, reference id
// project documents
// id, project_id, doc_name , type, file_path , document type , reference id


// $table->id();
// $table->string('project_name');
// $table->string('type');
// $table->string('status');
// $table->string('location');
// $table->string('start_date')->nullable();
// $table->string('end_date')->nullable();
// $table->string('budget');
// $table->string('description')->nullable();
// $table->string('objective')->nullable();
// $table->string('condition')->nullable();
// $table->string('other_infomation')->nullable();
// $table->string('progress')->nullable();


// $table->unsignedBigInteger('created_by'); 
// $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade');  

// $table->timestamps();
// $table->softDeletes(); 