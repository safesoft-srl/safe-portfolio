<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicPortfolioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'profile_name' => $this->profile_name,
            'profile_email' => $this->profile_email,
            'profession' => $this->profession,
            'bio' => $this->bio,
            'profile_image' => $this->profile_image,
            'url_portfolio' => $this->url_portfolio,
            'portfolio_name' => $this->portfolio_name,
            'portfolio_descrition' => $this->portfolio_descrition,
            'phone' => $this->phone,
            'city' => $this->city,
            'github_username' => $this->github_username,
            'linkedin_url' => $this->linkedin_url,
            'skills' => $this->portfolioSkills
                ->map(fn ($skill) => [
                    'name' => $skill->technicalSkill->name,
                    'url_dark' => $skill->technicalSkill->url_dark,
                    'url_light' => $skill->technicalSkill->url_light,
                ])
                ->values(),

        ];
    }
}
