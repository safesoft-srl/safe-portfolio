<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'institution_name',
        'title',
        'area',
        'workload_hours',
        'level',
        'certificate_date',
        'is_current',
        'is_visible',
        'description',
    ];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }
}
