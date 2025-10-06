<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category',
        'name',
        'rating',
        'price',
        'original_price',
        'about_product',
        'image_url',
        'description',
        'stock'
    ];

    protected $casts = [
        'about_product' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
} 