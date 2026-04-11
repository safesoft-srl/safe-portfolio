<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $guarded = [
        'proyect_id',
        'updated_at',
        'created_at', 
        ];

    public function portfolio() {
        return $this->belongsTo(Portfolio::class);
    }

    public function skill_projects()
    {
        return $this->belongsToMany(
            SkillProject::class, 
            'project_skill',  
            'project_id',      
            'skill_id'         
        );
    }

}
