<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items'              => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity'   => ['required', 'integer', 'min:1'],
            'cash_tendered'      => ['required', 'numeric', 'min:0.01'],
        ]);

        $saleId = DB::transaction(function() use ($validated, $request){
            $total     = 0;
            $saleItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock for \"{$product->name}\".",
                    ]);
                }
                
                $subtotal    = (float) $product->price * $item['quantity'];
                $total      += $subtotal;
                $saleItems[] = [
                    'product_id'   => $product->id,
                    'product_name' => $product->name,
                    'unit_price'   => $product->price,
                    'quantity'     => $item['quantity'],
                    'subtotal'     => round($subtotal, 2),
                ];

                $product->decrement('stock', $item['quantity']);

                $cash = (float) $validated['cash_tendered'];

                if ($cash < $total) {
                    throw ValidationException::withMessages([
                        'cash_tendered' => 'Cash tendered is less than the total.',
                    ]);
                }

                $sale = Sale::create([
                    'user_id'       => $request->user()->id,
                    'total'         => round($total, 2),
                    'cash_tendered' => $cash,
                    'change_amount' => round($cash - $total, 2),
                ]);

                $sale->items()->createMany($saleItems);

                return $sale->id;
            }
        });

        return redirect()->route('receipt',$saleId);
    }

    public function receipt(){

    }
}
