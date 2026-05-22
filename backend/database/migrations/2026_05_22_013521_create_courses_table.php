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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->onDelete('cascade');
            $table->string('institution_name', 60);
            $table->string('title', 60);
            $table->string('area', 50);
            $table->string('workload_hours', 10)->nullable();
            $table->string('level', 30)->nullable();
            $table->date('certificate_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->boolean('is_visible')->default(true);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
