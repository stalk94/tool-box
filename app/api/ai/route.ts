import { NextRequest, NextResponse } from 'next/server';
import { uploadImageAndGenerateBlock } from './upload';


export async function POST(req: NextRequest) {
    const form = await req.formData();
    const file = form.get('image') as File;
    const prompt = form.get('prompt') as string;

    if (!file || !prompt) {
        return NextResponse.json({ error: 'Нет файла или промпта' }, { status: 400 });
    }

    try {
        const json = await uploadImageAndGenerateBlock(file, prompt);
        return NextResponse.json({ success: true, json });
    } 
    catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}