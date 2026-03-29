<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a test user for development and frontend testing
        \App\Models\User::factory()->create([
            'name' => 'Admin SafePortfolio',
            'email' => 'admin@safeportfolio.com',
            'password' => bcrypt('password123'),
        ]);
    }
}
