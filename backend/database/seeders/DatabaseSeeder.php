<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Portfolio;
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
            'username' => 'admin_safe',
            'email' => 'admin@safeportfolio.com',
            'password' => bcrypt('password123'),
        ]);

        $this->call(UserSeeder::class);

        Portfolio::factory(3)->create();
    }
}
