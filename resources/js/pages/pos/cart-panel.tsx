interface CartItem {
    product: { id: number; name: string; price: string };
    quantity: number;
}

interface Props {
    cart: CartItem[];
    onUpdate: (cart: CartItem[]) => void;
}

export default function CartPanel({ cart }: Props) {
    return (
        <div className="flex w-80 flex-col border-l bg-muted/20 p-4">
            <h2 className="mb-4 text-lg font-semibold">Cart</h2>
            {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items yet. Click a product to add it.</p>
            ) : (
                <p className="text-sm">{cart.length} item(s) in cart</p>
            )}
        </div>
    );
}