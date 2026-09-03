import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ArrowLeft, PackageCheck, Truck, ShoppingBag } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, image: true, category: true },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Payment Confirmed
          </span>

          <h1 className="text-3xl font-extrabold text-slate-950 mt-3 mb-2">
            Thank you for your purchase!
          </h1>
          <p className="text-sm text-slate-500">
            We have received your order and begun provisioning your gear.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200">
            <span>Reference ID:</span>
            <span className="font-semibold text-slate-900">{order.id}</span>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-blue-600" /> Order Summary
          </h2>

          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.product?.name}</p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Subtotal</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-xs">
              <span>Standard Shipping</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-950 pt-2 border-t border-slate-100">
              <span>Total Paid</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Guarantee Info */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <Truck className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Fast Courier Dispatch</p>
              <p className="text-slate-400 text-[11px]">Tracking email will arrive soon.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <ShoppingBag className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-900">Hassle-Free Returns</p>
              <p className="text-slate-400 text-[11px]">30-day return policy on all items.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}