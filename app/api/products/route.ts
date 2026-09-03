import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/products -> Fetch all products from Neon
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/products -> Add a new product to Neon
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, image, description, features, stock } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        category,
        image: image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
        description: description || 'Workspace gear provisioned via Admin Console.',
        features: features && features.length > 0 ? features : ['Standard manufacturer warranty'],
        stock: parseInt(stock, 10),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}