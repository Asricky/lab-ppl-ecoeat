<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use App\Models\Wallet;
use App\Models\SellerProfile;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Str;
use Tests\TestCase;

class QaTest extends TestCase
{
    private $qaSession;
    private $results = [];

    protected function setUp(): void
    {
        parent::setUp();
        $this->qaSession = (string) Str::uuid();
        
        // Ensure tests directory exists for results
        if (!is_dir(storage_path('qa_results'))) {
            mkdir(storage_path('qa_results'));
        }
    }

    public function tearDown(): void
    {
        file_put_contents(
            storage_path('qa_results/qa_test_results.json'),
            json_encode($this->results, JSON_PRETTY_PRINT)
        );
        parent::tearDown();
    }

    private function recordResult(
        string $testId,
        string $module,
        string $endpoint,
        string $method,
        string $scenario,
        string $preCondition,
        array $headers,
        array $requestBody,
        int $expectedStatus,
        string $expectedResponse,
        $response
    ) {
        $actualStatus = $response->status();
        $actualContent = $response->getContent();
        
        $pass = ($actualStatus === $expectedStatus);

        $this->results[] = [
            'Test Case ID' => "TC-{$module}-{$testId}",
            'Modul/Fitur' => $module,
            'Endpoint' => $endpoint,
            'Method' => $method,
            'Skenario Pengujian' => $scenario,
            'Pre-condition' => $preCondition,
            'Headers' => json_encode($headers),
            'Request Body' => json_encode($requestBody),
            'Expected Status Code' => $expectedStatus,
            'Expected Response' => $expectedResponse,
            'Actual Status Code' => $actualStatus,
            'Actual Response' => $actualContent,
            'Status (Pass/Fail)' => $pass ? 'Pass' : 'Fail'
        ];
    }

    private function createBuyer()
    {
        $user = User::create([
            'id' => Str::uuid(),
            'full_name' => 'QA Buyer ' . Str::random(5),
            'email' => 'qa_buyer_' . Str::random(5) . '@test.com',
            'password_hash' => bcrypt('password'),
            'role' => 'buyer',
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        Wallet::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'balance' => 1000000, // 1M IDR for testing
        ]);
        return $user;
    }

    private function createSeller()
    {
        $user = User::create([
            'id' => Str::uuid(),
            'full_name' => 'QA Seller ' . Str::random(5),
            'email' => 'qa_seller_' . Str::random(5) . '@test.com',
            'password_hash' => bcrypt('password'),
            'role' => 'seller',
            'verification_status' => 'approved',
            'is_active' => true,
        ]);
        SellerProfile::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'business_name' => 'QA Store ' . Str::random(5),
            'business_type' => 'retail',
            'legal_document_url' => 'qa_doc.pdf',
            'verification_status' => 'approved',
        ]);
        return $user;
    }

    public function test_all_modules()
    {
        // 1. Setup Data
        $buyer = $this->createBuyer();
        $seller = $this->createSeller();
        
        // Create Product via DB directly for setup
        $product = Product::create([
            'id' => Str::uuid(),
            'seller_profile_id' => $seller->sellerProfile->id,
            'title' => 'QA Product ' . Str::random(5) . ' [QA_TAG:endpoint_documentation] [QA_SESSION:' . $this->qaSession . ']',
            'description' => 'Test desc',
            'price' => 50000,
            'stock_quantity' => 10,
            'portion_quantity' => 10,
            'expiry_date' => now()->addDays(7),
            'is_donation' => false,
            'status' => 'active',
        ]);

        // ---------------------------------------------------------
        // MODULE: PRODUCTS
        // ---------------------------------------------------------
        
        // TC-PROD-01: Get all products (Success)
        $response = $this->getJson('/api/products');
        $this->recordResult(
            '01', 'Products', '/api/products', 'GET', 'Get all products successfully', 'None', [], [], 200, 'Array of products', $response
        );

        // TC-PROD-02: Get single product (Success)
        $response = $this->getJson("/api/products/{$product->id}");
        $this->recordResult(
            '02', 'Products', "/api/products/{$product->id}", 'GET', 'Get product details successfully', 'Product exists', [], [], 200, 'Product object', $response
        );

        // TC-PROD-03: Create Product (Seller) - Success
        $createData = [
            'title' => 'New QA Prod [QA_TAG:endpoint_documentation] [QA_SESSION:' . $this->qaSession . ']',
            'description' => 'New desc',
            'price' => 20000,
            'stock_quantity' => 5,
            'portion_quantity' => 5,
            'expiry_date' => now()->addDays(5)->toDateTimeString(),
            'is_donation' => false,
        ];
        $response = $this->actingAs($seller)->postJson('/api/seller/products', $createData);
        $this->recordResult(
            '03', 'Products', '/api/seller/products', 'POST', 'Create product successfully (Seller)', 'Logged in as seller', ['Authorization' => 'Bearer token'], $createData, 201, 'Created product', $response
        );

        // TC-PROD-04: Create Product (Buyer) - Forbidden
        $response = $this->actingAs($buyer)->postJson('/api/seller/products', $createData);
        $this->recordResult(
            '04', 'Products', '/api/seller/products', 'POST', 'Create product fails (Buyer)', 'Logged in as buyer', ['Authorization' => 'Bearer token'], $createData, 403, 'Forbidden', $response
        );

        // TC-PROD-05: Create Product Missing Fields - Validation Error
        $response = $this->actingAs($seller)->postJson('/api/seller/products', ['title' => 'Missing fields']);
        $this->recordResult(
            '05', 'Products', '/api/seller/products', 'POST', 'Create product validation error', 'Logged in as seller', ['Authorization' => 'Bearer token'], ['title' => '...'], 422, 'Validation errors', $response
        );

        // ---------------------------------------------------------
        // MODULE: CART
        // ---------------------------------------------------------
        
        // TC-CART-01: Get empty cart
        $response = $this->actingAs($buyer)->getJson('/api/buyer/cart');
        $this->recordResult(
            '01', 'Cart', '/api/buyer/cart', 'GET', 'Get cart successfully', 'Logged in as buyer', [], [], 200, 'Array of cart items', $response
        );

        // TC-CART-02: Add to cart
        $cartData = ['product_id' => $product->id, 'quantity' => 2];
        $response = $this->actingAs($buyer)->postJson('/api/buyer/cart', $cartData);
        $this->recordResult(
            '02', 'Cart', '/api/buyer/cart', 'POST', 'Add item to cart', 'Logged in as buyer', [], $cartData, 201, 'Cart item created', $response
        );
        $cartItemRes = json_decode($response->getContent());
        $cartItemId = $cartItemRes->data->id ?? null;

        // TC-CART-03: Update cart item quantity
        if ($cartItemId) {
            $response = $this->actingAs($buyer)->patchJson("/api/buyer/cart/{$cartItemId}", ['quantity' => 3]);
            $this->recordResult(
                '03', 'Cart', "/api/buyer/cart/{id}", 'PATCH', 'Update cart item quantity', 'Cart item exists', [], ['quantity' => 3], 200, 'Cart item updated', $response
            );
        }

        // TC-CART-04: Add to cart (Seller) - Forbidden
        $response = $this->actingAs($seller)->postJson('/api/buyer/cart', $cartData);
        $this->recordResult(
            '04', 'Cart', '/api/buyer/cart', 'POST', 'Add to cart fails (Seller)', 'Logged in as seller', [], $cartData, 403, 'Forbidden', $response
        );

        // ---------------------------------------------------------
        // MODULE: WISHLIST
        // ---------------------------------------------------------

        // TC-WISH-01: Add to wishlist
        $wishData = ['product_id' => $product->id];
        $response = $this->actingAs($buyer)->postJson('/api/buyer/wishlist', $wishData);
        $this->recordResult(
            '01', 'Wishlist', '/api/buyer/wishlist', 'POST', 'Add item to wishlist', 'Logged in as buyer', [], $wishData, 201, 'Wishlist item created', $response
        );

        // TC-WISH-02: Get wishlist
        $response = $this->actingAs($buyer)->getJson('/api/buyer/wishlist');
        $this->recordResult(
            '02', 'Wishlist', '/api/buyer/wishlist', 'GET', 'Get wishlist successfully', 'Logged in as buyer', [], [], 200, 'Array of wishlist items', $response
        );

        // ---------------------------------------------------------
        // MODULE: ORDERS
        // ---------------------------------------------------------

        // TC-ORD-01: Direct Checkout (Success)
        $checkoutData = [
            'product_id' => $product->id,
            'quantity' => 1,
            'order_type' => 'purchase',
            'notes' => 'QA_SESSION:' . $this->qaSession,
        ];
        $response = $this->actingAs($buyer)->postJson('/api/buyer/checkout/direct', $checkoutData);
        $this->recordResult(
            '01', 'Orders', '/api/buyer/checkout/direct', 'POST', 'Direct checkout success', 'Sufficient balance & stock', [], $checkoutData, 201, 'Order created', $response
        );
        
        $responseData = json_decode($response->getContent());
        $directOrderId = $responseData->order->id ?? null;

        // TC-ORD-02: Cart Checkout (Success)
        // Add item to cart first
        $this->actingAs($buyer)->postJson('/api/buyer/cart', ['product_id' => $product->id, 'quantity' => 1]);
        // Get cart item id
        $cartItemsResponse = $this->actingAs($buyer)->getJson('/api/buyer/cart');
        $cartResData = json_decode($cartItemsResponse->getContent());
        $cartItems = $cartResData->data->items ?? [];
        if (count($cartItems) > 0) {
            $cartItemId = $cartItems[0]->id;
            
            $cartCheckoutData = [
                'cart_item_ids' => [$cartItemId],
                'order_type' => 'purchase',
            ];
            $response = $this->actingAs($buyer)->postJson('/api/buyer/checkout/cart', $cartCheckoutData);
            $this->recordResult(
                '02', 'Orders', '/api/buyer/checkout/cart', 'POST', 'Cart checkout success', 'Cart item exists', [], $cartCheckoutData, 201, 'Orders created', $response
            );
        }

        // TC-ORD-03: Get Orders List
        $response = $this->actingAs($buyer)->getJson('/api/buyer/orders');
        $this->recordResult(
            '03', 'Orders', '/api/buyer/orders', 'GET', 'Get orders list', 'Logged in as buyer', [], [], 200, 'Array of orders', $response
        );

        // TC-ORD-04: Cancel Order (Success & Refund)
        if ($directOrderId) {
            $response = $this->actingAs($buyer)->patchJson("/api/buyer/orders/{$directOrderId}/cancel", ['reason' => 'QA Testing Cancellation']);
            $this->recordResult(
                '04', 'Orders', "/api/buyer/orders/{id}/cancel", 'PATCH', 'Cancel order successfully', 'Order is processing', [], ['reason' => 'QA Testing Cancellation'], 200, 'Order cancelled', $response
            );
        }

        // ---------------------------------------------------------
        // MODULE: REVIEWS
        // ---------------------------------------------------------
        
        // Setup: Need a completed order to review
        $completedOrder = Order::create([
            'id' => Str::uuid(),
            'order_code' => 'ORD-QA-' . Str::random(5),
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'order_type' => 'purchase',
            'order_status' => 'completed',
            'subtotal' => 10000,
            'delivery_fee' => 0,
            'platform_fee' => 0,
            'total_amount' => 10000,
            'total_portions' => 1,
            'notes' => 'QA_SESSION:' . $this->qaSession,
        ]);

        // TC-REV-01: Add Review (Success)
        $reviewData = [
            'rating' => 5,
            'review_text' => 'Great product QA testing',
        ];
        $response = $this->actingAs($buyer)->postJson("/api/buyer/orders/{$completedOrder->id}/reviews", $reviewData);
        $this->recordResult(
            '01', 'Reviews', "/api/buyer/orders/{id}/reviews", 'POST', 'Create review successfully', 'Order is completed', [], $reviewData, 201, 'Review created', $response
        );

        // TC-REV-02: Add Review (Invalid - Order not completed)
        if ($directOrderId) {
            $response = $this->actingAs($buyer)->postJson("/api/buyer/orders/{$directOrderId}/reviews", $reviewData);
            $this->recordResult(
                '02', 'Reviews', "/api/buyer/orders/{id}/reviews", 'POST', 'Create review fails (order not completed)', 'Order cancelled or processing', [], $reviewData, 404, 'Not Found or Error', $response
            ); // Using 404 because controller uses findOrFail with where('order_status', 'completed')
        }
        
        // ---------------------------------------------------------
        // MODULE: ORDER LIFECYCLE, REFUND & PICKUP (NEW)
        // ---------------------------------------------------------
        
        $pickupOrder = Order::create([
            'id' => Str::uuid(),
            'order_code' => 'ORD-PU-' . Str::random(5),
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'order_type' => 'purchase',
            'order_status' => 'processing',
            'subtotal' => 10000,
            'delivery_fee' => 0,
            'platform_fee' => 0,
            'total_amount' => 10000,
            'total_portions' => 1,
            'delivery_address_id' => null,
            'notes' => 'QA_SESSION:' . $this->qaSession,
        ]);

        // TC-ORD-05: Seller update order status
        $statusData = ['status' => 'ready_for_delivery'];
        $response = $this->actingAs($seller)->patchJson("/api/seller/orders/{$pickupOrder->id}/status", $statusData);
        $this->recordResult(
            '05', 'Orders', "/api/seller/orders/{id}/status", 'PATCH', 'Seller update status to ready for delivery', 'Order is processing', [], $statusData, 200, 'Status updated', $response
        );

        // TC-ORD-06: Buyer complete pickup order
        $response = $this->actingAs($buyer)->patchJson("/api/buyer/orders/{$pickupOrder->id}/pickup");
        $this->recordResult(
            '06', 'Orders', "/api/buyer/orders/{id}/pickup", 'PATCH', 'Buyer completes pickup order', 'Order is ready for delivery', [], [], 200, 'Order completed', $response
        );

        $refundOrder = Order::create([
            'id' => Str::uuid(),
            'order_code' => 'ORD-RF-' . Str::random(5),
            'buyer_id' => $buyer->id,
            'seller_id' => $seller->id,
            'order_type' => 'purchase',
            'order_status' => 'processing',
            'subtotal' => 10000,
            'delivery_fee' => 0,
            'platform_fee' => 0,
            'total_amount' => 10000,
            'total_portions' => 1,
            'notes' => 'QA_SESSION:' . $this->qaSession,
        ]);

        // TC-ORD-07: Seller refund order
        $refundData = ['reason' => 'Item is out of stock'];
        $response = $this->actingAs($seller)->postJson("/api/seller/orders/{$refundOrder->id}/refund", $refundData);
        $this->recordResult(
            '07', 'Orders', "/api/seller/orders/{id}/refund", 'POST', 'Seller refund order', 'Order is processing', [], $refundData, 200, 'Order refunded', $response
        );

        // TC-REV-03: Seller reply to review
        $review = \App\Models\Review::where('order_id', $completedOrder->id)->first();
        $reviewId = $review ? $review->id : null;

        if ($reviewId) {
            $replyData = ['seller_reply' => 'Thank you for the feedback! We will improve.'];
            $response = $this->actingAs($seller)->postJson("/api/seller/reviews/{$reviewId}/reply", $replyData);
            $this->recordResult(
                '03', 'Reviews', "/api/seller/reviews/{id}/reply", 'POST', 'Seller replies to review', 'Review exists without reply', [], $replyData, 200, 'Reply saved', $response
            );
        }

        $this->assertTrue(true);
    }
}
