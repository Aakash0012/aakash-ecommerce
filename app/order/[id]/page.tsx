import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function OrderSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        ✓
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Order Confirmed!</h1>
      <p className="text-neutral-500 mt-2">
        Thank you for your purchase. We have received your order.
      </p>

      <div className="mt-8 bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-left space-y-3">
        <div className="flex justify-between border-b pb-3">
          <span className="text-neutral-500 text-sm">Order ID</span>
          <span className="font-mono text-sm font-semibold">{order.id}</span>
        </div>
        <div className="flex justify-between border-b pb-3">
          <span className="text-neutral-500 text-sm">Status</span>
          <span className="font-medium text-sm text-emerald-600 uppercase">
            {order.status}
          </span>
        </div>
        <div className="flex justify-between border-b pb-3">
          <span className="text-neutral-500 text-sm">Customer</span>
          <span className="font-medium text-sm">
            {order.customerName || "Guest"}
          </span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="font-semibold">Total Paid</span>
          <span className="font-bold text-lg">
            ${Number(order.totalAmount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition"
        >
          Return to Store
        </Link>
      </div>
    </main>
  );
}