import { NextRequest } from 'next/server';
import db from '../../db';


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key') || '';
    const value = await db.get(key);
    return Response.json(value);
}