import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Auto-calculate if total wasn't provided
    const computedTotal = items.reduce(
      (sum: number, item: any) => sum + Number(item.price || 0) * (item.quantity || 1),
      0
    );
    const finalAmount = body.totalAmount ?? body.total ?? computedTotal;

    const order = await prisma.order.create({
  data: {
    totalAmount: body.totalAmount ?? body.total ?? 0,
    customerName: customer?.name || "Guest Customer",
    customerEmail: customer?.email || null,
    customerPhone: customer?.phone || null,
    streetAddress: customer?.streetAddress || null,
    city: customer?.city || null,
    state: customer?.state || null,
    postalCode: customer?.postalCode || null,
    items: {
      create: items.map((item: any) => ({
        productId: item.id || item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  },
});

    // Return both orderId and id so whatever property the frontend reads will succeed
   return NextResponse.json({
      success: true,
      id: order.id,
      orderId: order.id,
      order: order,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}