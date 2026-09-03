'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2, Package, RefreshCw, ShoppingCart, DollarSign, Boxes, AlertTriangle } from 'lucide-react';

interface OrderItemRecord {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface OrderRecord {
  id: string;
  totalAmount: number;
  status: string;
  customer: string;
  createdAt: string;
  items: OrderItemRecord[];
}

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

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders'>('inventory');

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Peripherals');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('10');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);

      const prodData = await prodRes.json();
      const orderData = await orderRes.json();

      if (Array.isArray(prodData)) setProducts(prodData);
      if (Array.isArray(orderData)) setOrders(orderData);
    } catch (err) {
      console.error('Failed loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const parsedFeatures = features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price,
          category,
          image: image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
          stock,
          description: description || 'Workspace gear provisioned via Admin Console.',
          features: parsedFeatures.length > 0 ? parsedFeatures : ['Standard warranty'],
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setProducts([created, ...products]);
        setName('');
        setPrice('');
        setImage('');
        setDescription('');
        setFeatures('');
        setStock('10');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const totalCatalogValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 mb-2 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Storefront
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Admin Console</h1>
            <p className="text-sm text-slate-500">Live management synced with Neon PostgreSQL</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Cloud DB Connected
            </span>
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">${totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Inventory Value</span>
              <Boxes className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">${totalCatalogValue.toLocaleString()}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Units In Stock</span>
              <Package className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalUnits}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
              <span>Low Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{lowStockCount}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === 'inventory' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === 'orders' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'inventory' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Product Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Provision New Product
              </h2>
              <p className="text-xs text-slate-500 mb-5">Adds a record directly to Neon.</p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ergonomic Desk Mat"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="49.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Units In Stock</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="Peripherals">Peripherals</option>
                    <option value="Audio">Audio</option>
                    <option value="Displays">Displays</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Features (comma separated)</label>
                  <input
                    type="text"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '+ Add Product to Neon'}
                </button>
              </form>
            </div>

            {/* Inventory Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Live Inventory ({products.length})</h2>
                <Package className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-700 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3">Item</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-9 h-9 rounded object-cover bg-slate-100 flex-shrink-0" />
                          <span className="font-semibold text-slate-900 truncate max-w-[180px]">{item.name}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">{item.category}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-900">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            item.stock <= 3 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.stock} left
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Orders Feed */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" /> Customer Orders ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No customer orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                      <div>
                        <span className="text-xs font-mono text-slate-500">Order ID: {order.id.slice(0, 8)}...</span>
                        <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                          {order.status}
                        </span>
                        <span className="text-base font-bold text-slate-900">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs text-slate-700">
                          <div className="flex items-center gap-2">
                            <img src={item.product?.image} alt="" className="w-7 h-7 rounded object-cover bg-slate-200" />
                            <span className="font-medium">{item.product?.name}</span>
                            <span className="text-slate-400">&times; {item.quantity}</span>
                          </div>
                          <span className="font-semibold text-slate-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}