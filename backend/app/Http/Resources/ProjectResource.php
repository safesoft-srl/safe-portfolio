<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'portfolio_id' => $this->portfolio_id,
            'name' => $this->name,
            'description' => $this->description,
            'url_demo' => $this->url_demo,
            'url_github' => $this->url_github,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'current' => $this->current,
            'category' => $this->category,
            'url_image' => $this->url_image,
            'visible' => $this->visible,
            'skill_projects' => TechnicalSkillResource::collection($this->skills),
            'portfolio' => [
                'profile_name' => $this->portfolio->profile_name ?? null,
                'profile_email' => $this->portfolio->profile_email ?? null,
            ],

        ];
    }
}
