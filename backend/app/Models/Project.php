<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $guarded = [
        'project_id',
        'updated_at',
        'created_at',
    ];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function skills()
    {
        return $this->belongsToMany(
            TechnicalSkill::class,
            'project_skill',
            'project_id',
            'technical_skill_id'
        );
    }
}
