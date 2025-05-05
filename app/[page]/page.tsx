import { loadProjectConfig, loadLayoutConfig, loadPageSchema } from './helpers';
import ResponsiveRenderPage from './ResponsiveRender';
import { notFound } from 'next/navigation';



export default async function DynamicPage({ params }: { params: { page: string } }) {
    const config = await loadProjectConfig();
    const layoutConfig = await loadLayoutConfig();
    console.log(config)

    const pageKey = params.page || config.defaultPage;
    const pageEntry = config.routes?.[pageKey];
    const pageFile = `${pageKey}.json`;

    let pageSchema, headerSchema, footerSchema;

    
    try {
        pageSchema = await loadPageSchema(pageFile);
        headerSchema = layoutConfig.header ? await loadPageSchema(layoutConfig.header) : undefined;
        footerSchema = layoutConfig.footer ? await loadPageSchema(layoutConfig.footer) : undefined;
    } 
    catch (e) {
        return notFound();
    }


    return (
        <ResponsiveRenderPage
            schema={pageSchema}
            header={headerSchema}
            footer={footerSchema}
        />
    );
}