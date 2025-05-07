import { NextRequest } from 'next/server';
import { QuickDB } from 'quick.db';

const db = new QuickDB();


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') || '';
    const value = await db.get(key);
    return Response.json(value);
}