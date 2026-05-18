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
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('profile_name', 50);
            $table->string('profile_email', 50);
            $table->string('profession', 50);
            $table->text('bio');
            $table->string('portfolio_name', 50)->nullable();
            $table->text('portfolio_descrition')->nullable();
            $table->string('phone', 10)->nullable();
            $table->string('city', 50)->nullable();
            $table->string('profile_image')->nullable();
            $table->string('image_id')->nullable();
            $table->string('url_portfolio')->nullable();
            $table->string('portfolio_slug')->unique()->nullable();
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
