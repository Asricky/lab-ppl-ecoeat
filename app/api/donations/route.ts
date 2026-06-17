import { NextResponse } from 'next/server';

/**
 * Stitch / backend hook: insert into `donations` and notify LKS (server-side in production).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = `DON-${Date.now()}`;
    return NextResponse.json({ ok: true, id, received: body });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
