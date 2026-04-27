<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'profile_name',
        'profile_email',
        'profession',
        'bio',
        'profile_image',
        'image_id',
        'url_portfolio',
        'portfolio_slug',
        'is_public',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function portfolioSkills()
    {
        return $this->hasMany(PortfolioSkill::class);
    }

    public function workExperiences()
    {
        return $this->hasMany(WorkExperience::class);
    }
}
