<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TechnicalSkill extends Model
{
    protected $table = 'technical_skills';

    protected $fillable = [
        'name',
        'category',
        'icon_path',
    ];

    protected $appends = ['icon_url'];

    public function projects()
    {
        return $this->belongsToMany(
            Project::class,
            'project_skill',
            'skill_id',
            'project_id'
        );
    }

    public function getIconUrlAttribute()
    {
        return $this->icon_path
            ? url('storage/'.$this->icon_path)
            : null;
    }
}
