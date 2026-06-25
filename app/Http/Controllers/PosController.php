<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PosController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category')
            ->where('is_active',true)
            ->where('stock','>',0)
            ->orderBy('name')
            ->get();

        return Inertia::render('pos/index',[
            'products' => $products
        ]);
    }
}
