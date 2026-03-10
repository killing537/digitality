"use client";
import { useEffect, useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">New Collection</h1>
        <p className="mt-4 text-lg text-gray-500">Produk eksklusif, sekali terjual langsung hilang.</p>
      </header>

      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="aspect-square w-full overflow-hidden bg-gray-200 group-hover:opacity-75">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" />
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
