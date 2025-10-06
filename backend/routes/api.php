<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SellerAuthController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Product routes
Route::apiResource('products', ProductController::class);

// Order routes
Route::post('/orders', [OrderController::class, 'store']);
Route::apiResource('orders', OrderController::class)->except(['store']);
Route::get('/orders/seller', [OrderController::class, 'sellerOrders']);

Route::post('/seller/login', [SellerAuthController::class, 'login']);

Route::post('/products', [ProductController::class, 'store']);

Route::get('/products/{id}', [ProductController::class, 'show']);