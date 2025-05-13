import { toJSXProps } from './Inputs';
import { renderComponentSsr, formatJsx } from './utils';


export default function exportAppBar(
    logo: string,
    style: React.CSSProperties,
    elevation: number,
    height: number,
    styles: {
        logo: React.CSSProperties,
        navigation: React.CSSProperties
    }
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
    


    return (`
        import React from 'react';
        import { Box } from '@mui/material';
        import { AppBar, Start, LinearNavigation, MobailBurger } from '@lib/index';


        export default function HeaderBar( linkItems=[{id: 'test', label: 'test'}] ) {
            // реализация функции клика по элементу навигации 
            const handlerClickNavigation =(path: string)=> {
                sharedEmmiter.emit('event', {
                    path: path,
                    type: 'navigation'
                });
            }
            const transformUseRouter =()=> {
                const func =(items, parent?: string)=> {
                    return items.map((elem, index)=> {
                        if(!parent) elem.path = '/' + elem.id;
                        else elem.path = parent + '/' + elem.id;
            
                        elem.comand =()=> handlerClickNavigation(elem.path);
            
                        if(elem.children) {
                            func(elem.children, elem.path);
                        }
            
                        return elem;
                    });
                }
            
                const result = func(linkItems ?? []);
                return result;
            }


            return (
                <AppBar
                    style={{ ${toObjectLiteral(style)} }}
                    elevation={ ${elevation ?? 1}}
                    height={ ${height} }
                    start={
                        <Start>
                            <Box
                                component="img"
                                src={ "${logo}" }
                                alt="Logo"
                                sx={{ ${toObjectLiteral(styles?.logo)} }}
                            />
                        </Start>
                    }
                    center={
                        <LinearNavigation
                            sx={{ ${toObjectLiteral(styles?.navigation)} }}
                            items={transformUseRouter()}
                        />
                    }
                    end={
                        <React.Fragment>
                            <MobailBurger
                                items={transformUseRouter()}
                            />

                            {/** секция доп элементов */}
                            
                        </React.Fragment>
                    }
                />
            );
        }
    `);
}

export function exportBreadCrumbs(
    separator: React.JSX.Element,
    linkStyle: React.CSSProperties,
    style: React.CSSProperties
) {
    const separatorrender = separator ? renderComponentSsr(separator) : 'undefined';
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
    


    return (`
        import React from 'react';
        import { Breadcrumbs, BreadcrumbsProps } from '@lib/index';


        export default function BreadcrumbWrap( pathname='test/app', nameMap) {
            const handlePush =(href: string)=> {
                // реализация маршрутизатора
                sharedEmmiter.emit('event', {
                    path: href,
                    type: 'navigation'
                });
            }


            return (
                <div
                    style={{ ${toObjectLiteral(style)} }}
                >
                    <Breadcrumbs
                        nameMap={nameMap}
                        pathname={pathname}
                        separator={ ${separatorrender} }
                        push={(href)=> handlePush(href)}
                        linkStyle={{ ${toObjectLiteral(linkStyle)} }}
                        Link={({href, children})=> 
                            <div 
                                onClick={()=> handlePush(href)}
                            >
                                { children }
                            </div>
                        }
                    />
                </div>
            );
        }
    `);
}