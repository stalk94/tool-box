import { NextRequest } from 'next/server';


export async function POST(request: NextRequest, context: { params: { type: string }}) {
    const params = await Promise.resolve(context.params);

    const type = params.type;
    const body = await request.json();

    if(body.rating && body.path) {
        console.log(body.rating, body.path)
    }

}