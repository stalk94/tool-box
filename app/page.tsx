import React from 'react';
import { loadProjectConfig, loadLayoutConfig, loadPageSchema } from './[page]/helpers';
import ResponsiveRenderPage from './[page]/ResponsiveRender';



export default async function RootPage() {
    const config = await loadProjectConfig();
    const layoutConfig = await loadLayoutConfig();
    const defaultPageFile = `${config.defaultPage}.json`;

    let pageSchema, headerSchema, footerSchema;

    try {
        pageSchema = await loadPageSchema(defaultPageFile);
        headerSchema = layoutConfig.header ? await loadPageSchema(layoutConfig.header) : undefined;
        footerSchema = layoutConfig.footer ? await loadPageSchema(layoutConfig.footer) : undefined;
    }
    catch (err) {
        console.error('Ошибка загрузки главной страницы или layout', err);
        return <div>❌ Не удалось загрузить стартовую страницу</div>;
    }
    

    return (
        <ResponsiveRenderPage 
            schema={pageSchema}
            header={headerSchema}
            footer={footerSchema}
        />
    );
}