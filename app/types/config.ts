export type RouteConfig = {
    path: string
    title: string
    seo: {
        title: string
        description: string
    }
}


export interface PagesConfig {
    defaultPage: string
    layoutPage: string
    meta: {
        titleTemplate: string
        description: string
        favicon: string | "/favicon.ico",
        keywords: string
    }
    routes: {
        home: RouteConfig
        [key: string]: RouteConfig
    }
}