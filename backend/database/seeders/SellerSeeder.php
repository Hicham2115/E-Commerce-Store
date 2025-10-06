<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Seller;
use Illuminate\Support\Facades\Hash;

class SellerSeeder extends Seeder
{
    public function run()
    {
        Seller::create([
            'email' => 'admin@admin',
            'password' => Hash::make('admin123'),
        ]);
    }
}