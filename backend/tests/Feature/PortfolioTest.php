<?php

namespace Tests\Feature;

use App\Models\Portfolio;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_can_create_portfolio(): void
    {
        $user = User::factory()->create();

        $payload = [
            'user_id' => $user->id,
            'url_portfolio' => 'juan.com',
            'profile_name' => 'Juan Perez',
            'profile_email' => 'juan@example.com',
            'profession' => 'Software Developer',
            'bio' => 'Backend developer',
            'profile_image' => 'profile.jpg',
        ];

        $response = $this->postJson('/api/portfolios', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Recurso creado exitosamente.',
            ]);

        $this->assertDatabaseHas('portfolios', [
            'url_portfolio' => 'juan.com',
        ]);
    }

    public function test_can_get_all_portfolios(): void
    {
        $user = User::factory()->create();

        Portfolio::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);

        $response = $this->getJson('/api/portfolios');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_can_get_single_portfolio(): void
    {
        $user = User::factory()->create();

        $portfolio = Portfolio::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->getJson("/api/portfolios/{$portfolio->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $portfolio->id,
                ],
            ]);
    }
}
