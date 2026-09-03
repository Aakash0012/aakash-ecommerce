import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total, customer } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        totalAmount: total,
        customerName: customer?.name || "Guest Customer",
        customerEmail: customer?.email || null,
        customerPhone: customer?.phone || null,
        streetAddress: customer?.streetAddress || null,
        city: customer?.city || null,
        state: customer?.state || null,
        postalCode: customer?.postalCode || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
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