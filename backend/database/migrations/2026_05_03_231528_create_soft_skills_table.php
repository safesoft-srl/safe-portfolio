<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soft_skills', function (Blueprint $table) {
            $table->id();

            $table->foreignId('portfolio_id')
                ->constrained('portfolios')
                ->onDelete('cascade');

            $table->string('name', 45);
            $table->string('description', 255)->nullable();

            $table->timestamps();

            $table->unique(['portfolio_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soft_skills');
    }
};
