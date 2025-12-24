<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'link',
        'is_updated',
        'published_at',
    ];

    protected $casts = [
        'is_updated' => 'boolean',
        'published_at' => 'datetime',
    ];
}
