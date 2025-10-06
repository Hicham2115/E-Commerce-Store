<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->middleware('cors');
    }
    
    public function index()
    {
        return response()->json(Order::with(['items.product', 'user'])->get());
    }

    /**
     * Get orders for seller dashboard
     */
    public function sellerOrders()
    {
        try {
            $orders = Order::with(['items.product'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($orders);
        } catch (\Exception $e) {
            \Log::error('Error fetching seller orders: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch orders'], 500);
        }
    }

    public function store(Request $request)
    {
        \Log::info('Order creation request received', [
            'headers' => $request->headers->all(),
            'content_type' => $request->header('Content-Type'),
            'accept' => $request->header('Accept'),
            'request_data' => $request->all()
        ]);

        try {
            DB::beginTransaction();

            // Get JSON content if it's a JSON request
            $data = $request->all();
            \Log::info('Request data received:', $data);

            // If items is a string, decode it
            if (isset($data['items']) && is_string($data['items'])) {
                $data['items'] = json_decode($data['items'], true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    $error = 'Invalid items JSON: ' . json_last_error_msg();
                    \Log::error($error);
                    return response()->json(['message' => $error], 400);
                }
            }

            // Validate the request data
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email|max:255',
                'shipping_address' => 'required|string',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
            ]);

            \Log::info('Validation passed', ['validated' => $validated]);

            // Calculate total and prepare order items
            $total = 0;
            $orderItems = [];
            
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                if (!$product) {
                    throw new \Exception("Product with ID {$item['product_id']} not found");
                }
                
                $quantity = (int)($item['quantity'] ?? 1);
                $price = (float)($item['price'] ?? $product->price);
                
                $itemTotal = $price * $quantity;
                $total += $itemTotal;
                
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Create the order
            $order = Order::create([
                'user_id' => $validated['user_id'],
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'shipping_address' => $validated['shipping_address'],
                'status' => 'pending',
                'total_amount' => $total,
                'order_date' => now()
            ]);

            // Add order items
            foreach ($orderItems as &$orderItem) {
                $orderItem['order_id'] = $order->id;
            }
            
            \Log::info('Attempting to insert order items', ['items_count' => count($orderItems)]);
            $inserted = OrderItem::insert($orderItems);
            \Log::info('Order items inserted', ['inserted' => $inserted]);

            DB::commit();
            
            $orderWithRelations = $order->load(['items.product', 'user']);
            \Log::info('Order created successfully', ['order_id' => $order->id]);
            
            // Return the created order with its items and product details
            return response()->json([
                'message' => 'Order created successfully',
                'order' => $orderWithRelations
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            $errorMessage = 'Order creation failed: ' . $e->getMessage();
            \Log::error($errorMessage, [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['items.product', 'user']));
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled'
        ]);

        $order->update($validated);
        return response()->json($order->load(['items.product', 'user']));
    }
}
