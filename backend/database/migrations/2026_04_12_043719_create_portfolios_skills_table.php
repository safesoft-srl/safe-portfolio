<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolios_skills', function (Blueprint $table) {
            $table->id();

            $table->foreignId('portfolio_id')
                ->constrained('portfolios')
                ->onDelete('cascade');

            $table->foreignId('technical_skill_id')
                ->constrained('technical_skills')
                ->onDelete('cascade');

            $table->string('level', 50);

            // Evitar duplicados (mismo portfolio + misma skill)
            $table->unique(['portfolio_id', 'technical_skill_id']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios_skills');
    }
};



