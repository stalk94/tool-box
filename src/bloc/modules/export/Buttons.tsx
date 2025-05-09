import { toJSXProps } from './Inputs';


export function exportedMuiButton(
    startIconName,
    endIconName,
    style,
    children,
    otherProps
) {
    const rendericon = (icon) => icon ? `<${icon} />` : 'undefined';
    const importIcon = `import { ${startIconName??''}, ${endIconName??''} } from '@mui/icons-material';\n`;
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
   


    return (`
        import React from 'react';
        import { Button } from '@mui/material';
        ${importIcon}


        export default function ButtonWrap() {
            return (
                <Button
                    startIcon={${rendericon(startIconName)}}
                    endIcon={${rendericon(endIconName)}}
                    style={{ ${toObjectLiteral(style)} }}
                    ${ toJSXProps(otherProps) }
                >
                    { ${children} }
                </Button>
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