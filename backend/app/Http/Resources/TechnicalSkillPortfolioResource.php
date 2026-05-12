<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TechnicalSkillPortfolioResource extends JsonResource
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
            'technical_skill_id' => $this->technical_skill_id,
            'level' => $this->level,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'technical_skill' => new TechnicalSkillResource($this->whenLoaded('technicalSkill')),
        ];
    }
}
