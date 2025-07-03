import React from "react";
import { extractMuiStylesForContainer } from '../helpers/dom';
import type { RenderPageData, ProjectConfig } from '../type';
import Page from './Page';
import Render from './Render';


export const Ssr = ({config, size}: {config:ProjectConfig,size?:any}) => {
    const getRender = () => {
        const result = {}
        const wrapper = document.createElement('div');
        const refCell = document.querySelector('.SSR-CONTAINER');
        const styles = extractMuiStylesForContainer(refCell);
        wrapper.innerHTML = refCell.innerHTML;

        // Селекторы мусора
        const selectors = [
            '.react-resizable-handle',
            '.resize-box',
            '.editor-only',
            'script',
            'style[data-editor]',
        ];

       
        selectors.forEach((selector) => {
            wrapper.querySelectorAll(selector).forEach((el) => el.remove());
        });
        [...wrapper.children].map((child)=> {
            const key = child.getAttribute('id');
            result[key] = [...child.children][0].innerHTML;
        });

        return {
            styles,
            render: result
        };
    }
    const createPage = () => {
        
    }

    React.useEffect(()=> {
        setTimeout(()=> {
            const result = getRender();
            
        }, 2000);
    }, []);

    return (
        <div className="SSR-CONTAINER">
            {Object.entries(config.pages).map(([key, data]) =>
                <div id={key} style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: size?.width ?? '100vw',
                        maxWidth: '100%',
                        height: size?.height ?? '100vh',
                    }}
                >
                    <div className="PAGE-CONTAINER"
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            height: '100%',
                            overflowX: 'hidden',
                            overflowY: 'auto',
                        }}
                    >
                        {data.header &&
                            <Render
                                layouts={data.header.layouts}
                                cells={data.header.content}
                                size={data.header.size}
                            />
                        }
                        <Render
                            layouts={data.body.layouts}
                            cells={data.body.content}
                            size={data.body.size}
                        />
                        {data.footer &&
                            <Render
                                layouts={data.footer.layouts}
                                cells={data.footer.content}
                                size={data.footer.size}
                            />
                        }
                    </div>
                </div>
            )}
            <div id='root' 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: size?.width ?? '100vw',
                    maxWidth: '100%',
                    height: size?.height ?? '100vh',
                }}
            >
                <Page
                    theme={config.theme}
                    data={config.home}
                />
            </div>
        </div>
    );
}