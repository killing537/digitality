"use client";
import { useEffect, useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';

// 1. Definisikan tipe data produk
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function CatalogPage() {
  // 2. Beritahu useState bahwa ini adalah array dari Product
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20">Memuat produk...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* ... sisanya sama seperti sebelumnya ... */}
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Sekarang TypeScript tahu 'product.id', 'product.image', dll itu ada */}
            <div className="aspect-square w-full overflow-hidden bg-gray-200">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 text-lg font-bold text-indigo-600">Rp {product.price.toLocaleString()}</p>
              <Link href={`/checkout?id=${product.id}`} className="mt-4 flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                Beli Sekarang
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
