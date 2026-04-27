<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkExperience extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'company',
        'position',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'achievements',
        'is_visible',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'is_visible' => 'boolean',
    ];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }
}
