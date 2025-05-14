import { jsxJsonToString, formatJsx, renderComponentSsr, renderComponentSsrPrerender } from './utils';
import { htmlToJsx } from './Text';
import { Component, ComponentProps } from '../../type';


export function toJSXProps(obj: Record<string, any>): string {
    return Object.entries(obj || {})
        .map(([key, value]) => {
            if (typeof value === 'string') {
                return `${key}="${value}"`; // строки — в кавычки
            } 
            else if (typeof value === 'boolean') {
                return value ? key : ''; // disabled={false} → пропуск
            } 
            else {
                return `${key}={${JSON.stringify(value)}}`; // всё остальное — через {}
            }
        })
        .filter(Boolean)
        .join(' ');
}


export default function exported(
    activeIndexs: number[],
    styles: {title: React.CSSProperties, body: React.CSSProperties},
    items: {
        /** label аккордеона */
        title: React.ReactNode
        /** тело аккордеона */
        content: React.ReactNode
    }[],
    style: React.CSSProperties
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
    const jsxItems = items.map(({ title, content }) => {
            const titleStr = typeof title === 'string'
                ? JSON.stringify(title)
                : jsxJsonToString(title);

            const contentStr = typeof content === 'string'
                ? JSON.stringify(content)
                : jsxJsonToString(content);

        return `{
            title: ${titleStr},
            content: ${contentStr}
        }`;
    });
    
    
    return (`
        import React from 'react';
        import { Chip, Box, Button } from '@mui/material';
        import { Accordion } from '@lib/index';
        

        export default function AcordionWrap() {

            return (
                <div
                    style={{ ${toObjectLiteral(style)} }}
                >
                    <Accordion
                        activeIndexs={[${(activeIndexs??[]).toString()}]}
                        tabStyle={{ ${toObjectLiteral(styles?.body)} }}
                        headerStyle={{ ${toObjectLiteral(styles?.title)} }}
                        items={[
                            ${jsxItems.join(',\n')}
                        ]}
                    />
                </div>
            );
        }
    `);
}


export function exportedTabs(
    items: string[],
    textColor: "inherit" | "secondary" | "primary" | undefined,
    slots: [Component[]]
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
    const renderTab =()=> {
        return items ? items.map((elem, index) => (`
            <Tab
                key={${index}}
                label={"${elem}"}
            />
        `)) : [''];
    }


    return (`
        import React from 'react';
        import { Tabs, Tab } from '@mui/material';
        

        export default function TabNavigation() {

            return (
                <div
                    style={{ width: '100%', display: 'block' }}
                >
                    <Tabs
                        value={0}
                        onChange={(event: React.SyntheticEvent, newValue: number) => {
                            console.log(newValue)
                        }}
                        variant="scrollable"
                        scrollButtons={true}
                        allowScrollButtonsMobile={true}
                        textColor={ ${JSON.stringify(textColor)} }
                        aria-label="tabs"
                    >
                        ${renderTab().join('\n')}
                    </Tabs>
                </div>
            );
        }
    `);
}


export function exportedTable(
   
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }


    return (`
        import React from 'react';
        import { Accordion } from '@lib/index';
        

        export default function () {
            return (
                
            );
        }
    `);
}