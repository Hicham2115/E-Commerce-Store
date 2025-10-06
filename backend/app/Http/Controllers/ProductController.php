<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'original_price' => 'nullable|numeric',
            'category' => 'required|string|max:255',
            'about_product' => 'nullable|array',
            'stock' => 'required|integer',
            'rating' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = null;
        // Accept both file upload and direct image_url
        $image_url = $request->input('image_url');
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('uploads', 'public');
        } elseif ($image_url) {
            $imagePath = ltrim($image_url, '/'); // Store as is if provided
        }
        // Convert about_product to array if not already
        $aboutProduct = $request->about_product;
        if (is_string($aboutProduct)) {
            $aboutProduct = array_map('trim', explode(',', $aboutProduct));
        }
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('uploads', 'public');
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'original_price' => $request->original_price,
            'category' => $request->category,
            'about_product' => $request->about_product,
            'stock' => $request->stock,
            'rating' => $request->rating,
            'image_url' => $imagePath ? '/storage/' . $imagePath : null,
        ]);

        return response()->json($product, 201);
    }
    public function show($id)
{
    $product = Product::find($id);
    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }
    return response()->json($product);
}

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric',
            'original_price' => 'nullable|numeric',
            'category' => 'sometimes|string|max:255',
            'about_product' => 'nullable|array',
            'stock' => 'sometimes|integer',
            'rating' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->all();

        // Handle image upload if present
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image_url) {
                $oldImagePath = str_replace('/storage/', '', $product->image_url);
                if (Storage::disk('public')->exists($oldImagePath)) {
                    Storage::disk('public')->delete($oldImagePath);
                }
            }
            
            // Store new image
            $imagePath = $request->file('image')->store('uploads', 'public');
            $data['image_url'] = '/storage/' . $imagePath;
        } elseif ($request->has('image_url')) {
            $data['image_url'] = $request->input('image_url');
        }

        // Handle about_product conversion if it's a string
        if (isset($data['about_product']) && is_string($data['about_product'])) {
            $data['about_product'] = array_map('trim', explode(',', $data['about_product']));
        }

        $product->update($data);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Delete the associated image if it exists
        if ($product->image_url) {
            $imagePath = str_replace('/storage/', '', $product->image_url);
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
