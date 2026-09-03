import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();
    const correctSecret = process.env.ADMIN_SECRET || 'admin123';

    if (passcode !== correctSecret) {
      return NextResponse.json({ error: 'Invalid admin passcode' }, { status: 401 });
    }

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// Check auth status or log out
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  return NextResponse.json({ success: true });
}