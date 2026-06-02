<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_soft_skills', function (Blueprint $table) {
            $table->id();

            $table->foreignId('portfolio_id')
                ->constrained('portfolios')
                ->onDelete('cascade');

            $table->foreignId('soft_skill_id')
                ->constrained('soft_skills')
                ->onDelete('cascade');

            $table->string('description', 255)->nullable();

            $table->timestamps();

            $table->unique(['portfolio_id', 'soft_skill_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_soft_skills');
    }
};
