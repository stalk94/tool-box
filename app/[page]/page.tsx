import ResponsiveRenderPage from './ResponsiveRender';
import { DataRenderPage } from '../types/page';
import path from 'path';
import { promises as fs } from 'fs';



export default async function DynamicPage({ params }: { params: { page: string } }) {
    const filePath = path.join(process.cwd(), 'public', 'pages', `${params.page}.json`);
    let schema: DataRenderPage;

    try {
        const file = await fs.readFile(filePath, 'utf-8');
        schema = JSON.parse(file);
    } 
    catch (err) {
        return (
            <div style={{ padding: '2rem' }}>
                ❌ Страница "{params.page}" не найдена
            </div>
        );
    }


    return (
        <main style={{  }}>
            <ResponsiveRenderPage 
                schema={schema} 
            />
        </main>
    );
}