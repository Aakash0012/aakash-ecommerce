import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, ShieldCheck, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { AddToCartButton } from './AddToCartButton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Query Neon DB directly on the server
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="bg-slate-100 p-8 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-96 w-full object-contain rounded-lg drop-shadow-md"
            />
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-2 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-slate-950 mb-6">${product.price}</p>
              <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>

              <div className="space-y-2 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Key Specifications
                </h4>
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <AddToCartButton product={product} />

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-500 pt-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-400" />
                  <span>Free standard delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>2-year hardware warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}