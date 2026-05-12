<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioResource extends JsonResource
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
            'user_id' => $this->user_id,
            'profile_name'=> $this->profile_name,
            'profile_email'=> $this->profile_email,
            'profession'=> $this->profession,
            'bio'=> $this->bio,
            'profile_image'=> $this->profile_image,
            'image_id'=> $this->image_id,
            'url_portfolio'=> $this->url_portfolio,
            'portfolio_slug'=> $this->portfolio_slug,
            'is_public'=> $this->is_public,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'projects' => ProjectResource::collection($this->projects),
            'portfolio_skills' => TechnicalSkillPortfolioResource::collection($this->portfolioSkills),
            'work_experiences' => ExperienceResource::collection($this->workExperiences),
            ];
    }
}
