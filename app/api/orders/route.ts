import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders -> Fetch all orders with item details
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: { name: true, image: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}