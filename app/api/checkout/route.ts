import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total from items if body.total or body.totalAmount is not passed
    const computedTotal = items.reduce(
      (sum: number, item: any) => sum + Number(item.price || 0) * (item.quantity || 1),
      0
    );

    const finalAmount = body.totalAmount ?? body.total ?? computedTotal;

    const order = await prisma.order.create({
      data: {
        totalAmount: finalAmount,
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

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}