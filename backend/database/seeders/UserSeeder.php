<?php

namespace Database\Seeders;


use App\Models\User;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\Concerns\Has;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'jose',
            'email' => 'jose@gmail.com',
            'password' => Hash::make('12345678'),
        ]);

        User::factory(3)->create();
    }
}
