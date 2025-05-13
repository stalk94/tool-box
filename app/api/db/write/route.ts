import { NextRequest } from 'next/server';
import db from '../../db';


export async function POST(req: NextRequest) {
    const body = await req.json();
    const { key, value } = body;
    await db.set(key, value);
    return new Response('ok');
}