'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, X, CheckCircle2, Search, SlidersHorizontal, Loader2 } from 'lucide-react';
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

const CATEGORIES = ['All', 'Peripherals', 'Audio', 'Displays'];

export default function Storefront() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount } =
    useCartStore();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error('Failed to load products from DB', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({
            id: i.id,
            price: i.price,
            quantity: i.quantity,
          })),
          customer: 'Guest Shopper',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Checkout failed');
        return;
      }

      const orderData = await res.json();
      setCheckoutSuccess(true);

      // Refresh product list to show decremented stock
      const refreshed = await fetch('/api/products').then((r) => r.json());
      if (Array.isArray(refreshed)) setProducts(refreshed);

      // Clear the Zustand cart & close drawer
      clearCart();
      setIsDrawerOpen(false);

      // Redirect user directly to their dedicated order receipt page
      router.push(`/order/${orderData.id}`);
    } catch (err) {
      console.error(err);
      alert('Error processing your order');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
              A
            </span>
            <span className="font-bold text-xl tracking-tight">ApexStore</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-xs font-semibold text-slate-600 hover:text-slate-950 border border-slate-200 px-3.5 py-2 rounded-full transition bg-white"
            >
              Admin
            </Link>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 transition shadow-sm"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
              <span className="font-semibold text-sm">Cart</span>
              {totalItems() > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8 text-center max-w-xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-950">
            Engineered Workspace Gear.
          </h1>
          <p className="mt-3 text-slate-600">
            Connected to cloud PostgreSQL with reactive caching and real-time inventory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block mr-1" />
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
            <span>Connecting to Neon database...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>No products found in the catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
              >
                <Link href={`/product/${product.id}`} className="aspect-square relative bg-slate-100 overflow-hidden block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-slate-900 mt-1 hover:underline">{product.name}</h3>
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold">Your Bag ({totalItems()})</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center border-b border-slate-50 pb-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 truncate">{item.name}</h4>
                      <p className="text-sm text-slate-500">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between text-base font-semibold text-slate-900 mb-4">
                  <span>Subtotal</span>
                  <span>${totalAmount().toFixed(2)}</span>
                </div>
                {checkoutSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800 flex items-center justify-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Order placed! Redirecting...
                  </div>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition shadow-lg shadow-slate-900/10 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing Order...
                      </>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}