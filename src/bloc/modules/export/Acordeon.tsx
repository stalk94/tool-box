import { renderComponentSsr, formatJsx } from './utils';
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
    tabStyle: React.CSSProperties,
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


    return (`
        import React from 'react';
        import { Accordion } from '@lib/index';
        

        export default function AcordionWrap() {
            return (
                <div
                    style={{ ${toObjectLiteral(style)} }}
                >
                    <Accordion
                        activeIndexs={[${(activeIndexs??[]).toString()}]}
                        tabStyle={{ ${toObjectLiteral(tabStyle)} }}
                        items={ ${toObjectLiteral(items)} }
                    />
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