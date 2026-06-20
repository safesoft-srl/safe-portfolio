<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TechnicalSkillRequest extends Model
{
    use HasFactory;

    protected $table = 'technical_skill_requests';

    protected $fillable = [
        'user_id',
        'name',
        'status',
        'reviewed_by',
        'reviewed_at',
        'final_skill_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function finalSkill()
    {
        return $this->belongsTo(
            TechnicalSkill::class,
            'final_skill_id'
        );
    }
}
