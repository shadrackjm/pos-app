<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = today();

        $todaySales = Sale::whereDate('created_at',$today)
            ->where('status','completed')
            ->get();

        // top product
        $topProduct = SaleItem::select(
            'product_name',
            DB::raw('SUM(quantity) as total_qty'),
            DB::raw('SUM(subtotal) as total_revenue')
        )
        ->whereHas('sale', fn($q) => $q->whereDate('created_at',$today)->where('status','completed'))
        ->groupBy('product_name')
        ->orderByDesc('total_qty')
        ->limit(5)
        ->get();

        // recent sales
        $recentSales = Sale::with('items')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('dashboard',[
            'stats' => [
                    'today_revenue'      => number_format((float) $todaySales->sum('total'), 2),
                    'today_transactions' => $todaySales->count(),
                    'total_products' => Product::where('is_active', true)->count(),
                    'low_stock_count' => Product::where('stock', '<=', 5)->where('stock', '>', 0)->count(),
                ],
                'top_products' => $topProduct,
                'recent_sales' => $recentSales,
            ]);
    }
}
