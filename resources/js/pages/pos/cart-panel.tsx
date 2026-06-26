import { CartItem, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface CartItem {
    product: { id: number; name: string; price: string };
    quantity: number;
}

interface Props {
    items: CartItem[];
    subtotal: number;
    onRemove: (productId: number) => void;
    onSetQuantity: (productId: number, qty: number) => void;
    onClear: () => void;
    onCheckout: () => void;
}

export default function CartPanel({ items, subtotal, onRemove, onSetQuantity, onClear, onCheckout }: Props) {
    return (
        <div className="flex w-80 flex-col border-l">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-semibold">Cart</h2>
                {items.length > 0 && (
                    <button onClick={onClear} className="text-xs text-muted-foreground hover:text-destructive">
                        Clear all
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No items yet.
                    </p>
                ) : (
                    items.map(item => (
                        <div key={item.product.id} className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">${item.product.price} each</p>
                            </div>
                            <Input
                                type="number"
                                min={1}
                                max={item.product.stock}
                                value={item.quantity}
                                onChange={e => onSetQuantity(item.product.id, parseInt(e.target.value) || 0)}
                                className="w-16 text-center"
                            />
                            <button onClick={() => onRemove(item.product.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="space-y-3 border-t p-4">
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={items.length === 0}
                    onClick={onCheckout}
                >
                    Checkout
                </Button>
            </div>
        </div>
    );
}