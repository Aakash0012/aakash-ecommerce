'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '@/lib/cartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  features: string[];
  stock: number;
}

export function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3.5 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-sm ${
        added
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-900 hover:bg-slate-800 text-white'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" /> Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" /> Add to Cart
        </>
      )}
    </button>
  );
}