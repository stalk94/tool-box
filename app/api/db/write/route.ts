import { NextRequest } from 'next/server';
import { QuickDB } from 'quick.db';

const db = new QuickDB();


export async function POST(req: NextRequest) {
    const body = await req.json();
    const { key, value } = body;
    await db.set(key, value);
    return new Response('ok');
}