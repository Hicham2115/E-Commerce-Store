<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\File;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $json = File::get(base_path('../frontend/src/data.json'));
        $products = json_decode($json, true);

        foreach ($products as $product) {
            // Convert price strings to numbers by removing $ and converting to float
            $price = (float) str_replace(['$', ','], '', $product['price']);
            $originalPrice = (float) str_replace(['$', ','], '', $product['original_price']);

            Product::create([
                'category' => $product['category'],
                'name' => $product['name'],
                'description' => $product['description'] ?? null,
                'rating' => $product['rating'],
                'price' => $price,
                'original_price' => $originalPrice,
                'about_product' => $product['about_product'],
                'image_url' => $product['image_url']
            ]);
        }
    }
}
