import { get, set } from 'idb-keyval';


const IMAGE_STORE_KEY = 'images';


export async function saveImage(id: string, base64: string) {
    const images = await get(IMAGE_STORE_KEY) || {};
    images[id] = base64;
    await set(IMAGE_STORE_KEY, images);
}

export async function getImage(id: string): Promise<string | undefined> {
    const images = await get(IMAGE_STORE_KEY) || {};
    return images[id];
}

export async function deleteImage(id: string) {
    const images = await get(IMAGE_STORE_KEY) || {};
    delete images[id];
    await set(IMAGE_STORE_KEY, images);
}

export async function getAllImages(): Promise<Record<string, string>> {
    return await get(IMAGE_STORE_KEY) || {};
}