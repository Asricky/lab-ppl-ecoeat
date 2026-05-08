import { NextResponse } from 'next/server';

/**
 * Stitch / backend hook: commercial product publish.
 * Expects JSON body including `type: 'sell'`.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body?.type !== 'sell') {
      return NextResponse.json(
        { ok: false, error: 'Invalid type; expected sell' },
        { status: 400 }
      );
    }
    if (
      body.discountPercent != null &&
      (typeof body.discountPercent !== 'number' ||
        body.discountPercent < 20)
    ) {
      return NextResponse.json(
        { ok: false, error: 'discountPercent must be at least 20' },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: true, received: body });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
