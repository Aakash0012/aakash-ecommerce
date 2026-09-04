import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CartItemInput {
  id: string;
  price: number;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, userId, customerName, customerEmail } = body as {
      items: CartItemInput[];
      userId?: string | null;
      customerName?: string | null;
      customerEmail?: string | null;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or invalid' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    // Execute order creation and stock decrements atomically
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create Order with linked userId if authenticated
      const createdOrder = await tx.order.create({
        data: {
          totalAmount,
          status: 'PAID',
          userId: userId || null,
          customerName: customerName || 'Guest Customer',
          customerEmail: customerEmail || null,
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 2. Decrement inventory counts for each purchased product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return createdOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Checkout processing error:', error);
    return NextResponse.json(
      { error: 'Internal checkout error. Failed to process order.' },
      { status: 500 }
    );
  }
}