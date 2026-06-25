import { Input } from '@/components/ui/input';
import { Product, CartItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, Search } from 'lucide-react';
import { useState } from 'react';
import ProductGrid from './product-grid';
import CartPanel from './cart-panel';

interface Props {
    products: Product[];
}

export default function PosIndex({ products }: Props) {
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.category.name.toLowerCase().includes(search.toLowerCase())
    );


    function addItem(product: Product) {
        setCart(current => {
            const existing = current.find(item => item.product.id === product.id);
            if (existing) {
                return current.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { product, quantity: 1 }];
        });
    }


    return (
        <>
            <Head title="Point of Sale" />
            <div className="flex h-screen flex-col bg-background">
                {/* Top Bar */}
                <div className="flex items-center gap-4 border-b px-4 py-3">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                        <LayoutGrid className="h-5 w-5" />
                    </Link>
                    <span className="font-semibold">Point of Sale</span>
                    <div className="relative ml-4 flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search products…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Main area */}
                <div className="flex flex-1 overflow-hidden">
                    <ProductGrid products={filtered} onAdd={addItem} />
                    <CartPanel cart={cart} onUpdate={setCart} />
                </div>
            </div>
        </>
    )
}