import { Product } from '@/types';

interface CartItem {
    product: Product;
    quantity: number;
}

interface Props {
    products: Product[];
    onAdd: (product: Product) => void;
}

export default function ProductGrid({ products, onAdd }: Props) {
    if (products.length === 0) {
        return (
            <div className='flex flex-1 items-center justify-center text-muted-foreground'>
                No Products found.
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map(product => (
                    <button
                        key={product.id}
                        onClick={() => onAdd(product)}
                        className="group flex flex-col overflow-hidden rounded-xl border bg-card text-left transition-all hover:border-primary hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                    {product.image ?(
                        <img
                            src={`/storage/${product.image}`}
                            alt={product.name}
                            className="aspect-square w-full object-cover"
                        />
                    ) : (
                        <div className="flex aspect-square w-full items-center justify-center bg-muted text-3xl text-muted-foreground">
                            {product.name.charAt(0)}
                        </div>
                    )}
                        <div className='p-2'>
                                <p className="truncate text-sm font-medium">{product.name}</p>
                                <p className="text-sm font-bold text-primary">${product.price}</p>
                                <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>                      
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}