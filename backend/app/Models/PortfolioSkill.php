<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioSkill extends Model
{
    protected $table = 'portfolios_skills';

    protected $fillable = [
        'technical_skill_id',
        'portfolio_id',
        'level',
    ];
}
