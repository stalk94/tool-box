import { toJSXProps, toObjectLiteral } from './utils';


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