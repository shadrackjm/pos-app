import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import type { CartItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    open: boolean;
    items: CartItem[];
    subtotal: number;
    onSuccess: () => void;
    onClose: () => void;
}

export default function CheckoutDialog({ open, items, subtotal, onSuccess, onClose }: Props) {
    const [cashInput, setCashInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cash = parseFloat(cashInput) || 0;
    const change = cash - subtotal;

    function handleCheckout() {
        if (cash < subtotal) {
            setError('Cash amount is less than the total.');
            return;
        }
        setError(null);
        setProcessing(true);

        router.post(
            '/checkout',
            {
                items:         items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
                cash_tendered: cash,
            },
            {
                onSuccess: () => {
                    setProcessing(false);
                    setCashInput('');
                    onSuccess();
                },
                onError: (errors) => {
                    setProcessing(false);
                    setError(Object.values(errors)[0] as string);
                    toast.error('Checkout failed. Please check the errors.');
                },
            },
        );
    }


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4 space-y-1">
                        {items.map(i => (
                            <div key={i.product.id} className="flex justify-between text-sm">
                                <span>{i.product.name} × {i.quantity}</span>
                                <span>${(parseFloat(i.product.price) * i.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold pt-2 border-t mt-2">
                            <span>Total</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                    </div>
                    {/* Cash input */}
                    <div>
                        <Label htmlFor="cash">Cash Tendered</Label>
                        <Input
                            id="cash"
                            type="number"
                            step="0.01"
                            min={subtotal.toFixed(2)}
                            placeholder="0.00"
                            value={cashInput}
                            onChange={e => { setCashInput(e.target.value); setError(null); }}
                            autoFocus
                        />
                    </div>
                    {/* Change */}
                    {cashInput && (
                        <div className="flex justify-between text-lg font-bold">
                            <span>Change</span>
                            <span className={change >= 0 ? 'text-green-600' : 'text-destructive'}>
                                ${change.toFixed(2)}
                            </span>
                        </div>
                    )}

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button
                        className="w-full"
                        size="lg"
                        disabled={processing || !cashInput || cash < subtotal}
                        onClick={handleCheckout}
                    >
                        {processing ? 'Processing…' : 'Complete Sale'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}