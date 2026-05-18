<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Academyc_Training extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'institution_name',
        'title',
        'field_of_study',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'is_visible',
    ];

    public function portfolio()
    {
        return $this->belongsTo(Portfolio::class);
    }
}
