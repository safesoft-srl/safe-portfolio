<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SoftSkillResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'soft_skill' => [
                'id' => $this->softSkill->id,
                'name' => $this->softSkill->name,
            ],
        ];
    }
}
