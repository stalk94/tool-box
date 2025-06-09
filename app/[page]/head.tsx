import { loadProjectConfig } from './helpers';
import { Metadata } from 'next';
import { headers } from 'next/headers';


export async function generateMetadata({ params }: { params: { page: string } }): Promise<Metadata> {
    const config = await loadProjectConfig();
    
    const pageKey = params.page || config.defaultPage;
    const route = config.routes?.[pageKey];
    
    const pageMeta = route?.seo ?? {};
    const titleTemplate = config.meta?.titleTemplate ?? '%s';
    

    return {
        title: pageMeta?.title
            ? titleTemplate.replace('%s', pageMeta?.title)
            : (route?.title ?? 'page'),
        description: pageMeta?.description ?? config.meta?.description,
        keywords: config.meta?.keywords,
        icons: {
            icon: config.meta?.favicon || '/favicon.ico'
        }
    };
}