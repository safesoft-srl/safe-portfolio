<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TechnicalSkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'urls' => [
                'light' => $this->url_light,
                'dark' => $this->url_dark,
            ],
            'is_active' => (bool) $this->is_active, 
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}