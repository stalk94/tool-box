import { toJSXProps } from './Inputs';
import { renderComponentSsr, formatJsx } from './utils';



export function exportedMuiButton(
    id: string | number,
    startIcon: string | 'none',
    endIcon: string | 'none',
    style: React.CSSProperties,
    children: string,
    otherProps: any
) {
    const rendericon = (icon) => icon ? renderComponentSsr(icon) : 'undefined';
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
   
    return (`
        import React from 'react';
        import { Button } from '@mui/material';


        export default function ButtonWrap() {
            return (
                <Button
                    startIcon={
                        ${rendericon(startIcon)}
                    }
                    endIcon={${rendericon(endIcon)}}
                    style={{ ${toObjectLiteral(style)} }}
                    ${ toJSXProps(otherProps) }
                    onClick={()=> sharedEmmiter.emit('event', {
                        id: ${id},
                        type: 'click'
                    })}
                >
                    ${children} 
                </Button>
            );
        }
    `);
}
export function exportedMuiIconButton(
    id: string | number,
    icon: string | 'none',
    style: React.CSSProperties,
    otherProps: any
) {
    const rendericon = (icon) => icon ? renderComponentSsr(icon) : 'undefined';
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
   

    return (`
        import React from 'react';
        import { IconButton } from '@mui/material';


        export default function IconButtonWrap() {
            return (
                <IconButton
                    style={{ ${toObjectLiteral(style)} }}
                    onClick={()=> sharedEmmiter.emit('event', {
                        id: ${id},
                        type: 'click'
                    })}
                    ${ toJSXProps(otherProps) }
                >
                    ${ rendericon(icon) } 
                </IconButton>
            );
        }
    `);
}


export function exportButtonInline(
    style: React.CSSProperties,
) {
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
   


    return (`
        import React from 'react';


        export default function Button() {
            return (
                <button
                    style={{ ${toObjectLiteral(style)} }}
                >
                    { ${children} }
                </button>
            );
        }
    `);
}