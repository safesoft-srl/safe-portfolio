<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PortfolioSoftSkill extends Model
{
    use HasFactory;

    protected $table = 'portfolio_soft_skills';

    protected $fillable = [
        'portfolio_id',
        'soft_skill_id',
        'description',
    ];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }

    public function softSkill()
    {
        return $this->belongsTo(SoftSkill::class, 'soft_skill_id');
    }
}
