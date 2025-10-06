<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Seller;
use Illuminate\Support\Facades\Hash;

class SellerAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $seller = Seller::where('email', $request->email)->first();

        if ($seller && Hash::check($request->password, $seller->password)) {
            // Success: redirect or return dashboard info
            return response()->json([
                'message' => 'Login successful. Welcome to the dashboard!',
                'dashboard' => true
            ]);
        } else {
            // Error: invalid credentials
            return response()->json([
                'message' => 'Invalid email or password.',
                'dashboard' => false
            ], 401);
        }
    }
}
