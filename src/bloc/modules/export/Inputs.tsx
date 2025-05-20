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
    type: 'text'|'number'|'date'|'chek'|'switch'|'toogle'|'select'|'autocomplete'|'file', 
    leftIconName: string, 
    style: React.CSSProperties, 
    labelStyle: React.CSSProperties, 
    styles: any, 
    otherProps: any
) {
    const rendericon = () => (leftIconName && leftIconName!=='none')  ? `<${leftIconName} />` : 'undefined';
    const importIcon = (leftIconName && leftIconName!=='none') ? `import { ${leftIconName} } from '@mui/icons-material';\n` : '';
    const rendertype = {
        text: 'TextInput',
        number: 'NumberInput',
        date: 'DateInput',
        chek: 'CheckBoxInput',
        switch: 'SwitchInput',
        toogle: 'ToggleInput',
        select: 'SelectInput',
        autocomplete: 'AutoCompleteInput',
        file: 'FileInput'
    }[type];
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }
   


    return (`
        import React from 'react';
        import { ${rendertype} } from '@lib/index';
        ${importIcon}


        export default function Label${rendertype}() {
            return (
                <div 
                    style={{ ${toObjectLiteral(style)} }}
                >
                    <${rendertype}
                        left={ ${rendericon()} }
                        labelSx={{ ${toObjectLiteral(labelStyle)} }}
                        onChange={(v)=> console.log(v)}
                        styles={{ ${toObjectLiteral(styles)} }}
                        ${ toJSXProps(otherProps) }
                    />
                </div>
            );
        }
    `);
}

export function sliderRender( 
    startIconName: string, 
    endIconName: string,
    style: React.CSSProperties, 
    labelStyle: React.CSSProperties, 
    otherProps: any
) {
    if(startIconName === 'none') startIconName = undefined;
    if(endIconName === 'none') endIconName = undefined;
    const importIcon = `import { ${startIconName??''}, ${endIconName??''} } from '@mui/icons-material';\n`;
    const rendericon = (iconName) => iconName ? `<${iconName} />` : 'undefined';
    const toObjectLiteral = (obj) => {
        return Object.entries(obj || {})
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(', ');
    }

    return (`
        import React from 'react';
        import { SliderInput } from '@lib';
        ${importIcon}


        export default function LabelSliderInput() {
            return (
                <div 
                    style={{ ${toObjectLiteral(style)} }}
                >
                    <SliderInput
                        start={${rendericon(startIconName)}}
                        end={${rendericon(endIconName)}}
                        labelSx={{ ${toObjectLiteral(labelStyle)} }}
                        onChange={(v)=> console.log(v)}
                        ${ toJSXProps(otherProps) }
                    />
                </div>
            );
        }
    `);
}