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
    const { items, customer = 'Guest Customer' } = body as {
      items: CartItemInput[];
      customer?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total amount on the server for safety
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Use a Prisma transaction: create Order, OrderItems, and decrement inventory together
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Verify stock availability
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      // 2. Create the Order and associated line items
      const order = await tx.order.create({
        data: {
          totalAmount,
          customer,
          status: 'COMPLETED',
          items: {
            create: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 3. Decrement stock for each product
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

      return order;
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete checkout' },
      { status: 500 }
    );
  }
}