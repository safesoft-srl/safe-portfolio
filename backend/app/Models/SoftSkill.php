<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class SoftSkill extends Model
{
    protected $table = 'soft_skills';

    protected $fillable = [
        'portfolio_id',
        'name',
        'description',
    ];
}
