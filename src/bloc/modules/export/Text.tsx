import { htmlToJsx, toJSXProps, toObjectLiteral } from './utils';
import { rendeHtml } from '../tip-tap';
import { JSONContent } from '@tiptap/react';
import { SxProps } from '@mui/material';




export function exportText(
    text: JSONContent,
    style: React.CSSProperties,
) {

    return (`
        import React from 'react';


        export default function Text() {
            return (
                <div
                    style={{ ${toObjectLiteral(style)} }}
                >
                    ${ htmlToJsx(rendeHtml(text)) }
                </div>
            );
        }
    `);
}
export function exportTypography(
    text: string,
    sx: SxProps,
    style: React.CSSProperties,
    otherProps: any
) {

    return (`
        import React from 'react';
        import { Typography } from '@mui/material';


        export default function TypographyWrap() {
            return (
                <Typography
                    sx={{ ${toObjectLiteral(sx)} }}
                    style={{ ${toObjectLiteral(style)} }}
                    ${ toJSXProps(otherProps) }
                >
                    ${ text }
                </Typography>
            );
        }
    `);
}