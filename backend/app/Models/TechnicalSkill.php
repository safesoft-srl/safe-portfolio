<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TechnicalSkill extends Model
{
    protected $table = 'technical_skills';

    protected $fillable = [
        'name',
        'category',
        'url_light',
        'url_dark',
    ];

    protected $hidden = ['pivot'];

    public function projects()
    {
        return $this->belongsToMany(
            Project::class,
            'project_skill',
            'technical_skill_id',
            'project_id'
        );
    }
}
