<?php

namespace Database\Factories;

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Portfolio>
 */
class PortfolioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'user_id' => User::all()->random()->id,
            'profile_name' => $this->faker->name(),
            'profile_email' => $this->faker->unique()->safeEmail(),
            'profession' => fake()->randomElement(['Backend Developer', 'Frontend Developer', 'Fullstack', 'Mobile Dev']),
            'bio' => $this->faker->sentence(),
            'profile_image' => null,
            'url_portfolio' => $this->faker->url(),
        ];
    }
}
