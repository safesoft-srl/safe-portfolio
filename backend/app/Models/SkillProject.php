<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkillProject extends Model
{
    protected $table = 'skill_projects';

    protected $fillable = [
        'skill_name',
        'url_logo',
    ];

    protected $hidden = ['pivot'];

    public function projects()
    {
        return $this->belongsToMany(
            Project::class,
            'project_skill',
            'skill_id',
            'project_id'
        );
    }
}
