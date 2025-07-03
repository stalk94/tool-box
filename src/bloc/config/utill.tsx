import React from "react";
import { Theme, Tooltip } from "@mui/material";
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight, LinearScale,  
    ViewColumn, ViewList, ViewQuilt, ViewArray, ViewCarousel, ViewComfy, ViewCompact, 
    ViewModule, ViewAgenda, Widgets
} from "@mui/icons-material";
import { fill, empty } from '../../components/tools/icons-rating';
import { iconsList } from '../../components/tools/icons';
import { RegistreTypeComponent } from './type';
import { Schema, AccordionScnema } from '../../index';
import { flexOptions, textOptions } from './style';
import { iconListStyle } from './style-icons';
import metaProps from './props';                 // списки возможных пропсов каждого компонента


// список возмозных иконок (заменит варрианты)
const displayIcons = {
    left: <FormatAlignLeft aria-label="left" />,
    center: <FormatAlignCenter aria-label="center" />,
    right: <FormatAlignRight aria-label="right" />,
    justify: <FormatAlignJustify aria-label="justify" />,

    initial: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}> init </span>,
    block: <LinearScale />,
    inline: <ViewColumn />,
    'inline-block': <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>in -b </span>,
    flex: <Widgets />,
    'inline-flex': <ViewList />,
    grid: <ViewQuilt />,
    'inline-grid': <ViewArray />,
    none: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>✖️</span>
}
// отделяет значения числовые от постфиксов
export function parseStyleValue(value?: string) {
    if (typeof value !== 'string') return { number: 0, unit: '' };

    const match = value.match(/^([\d.]+)([a-z%]*)$/);
    if (!match) return { number: 0, unit: '' };

    const [, number, unit] = match;
    const num = parseFloat(number);
    return {
        number: isNaN(num) ? 0 : num,
        unit,
    };
}
const decorize = (keyListStyle: string, keyListVariant: string) => {
    const list = iconListStyle[keyListStyle];
    

    if(list && list[keyListVariant]) {
        const Icon = list[keyListVariant];

        return(
            <Tooltip title={keyListVariant} placement="top" arrow >
                <Icon sx={{fontSize: '14px'}} />
            </Tooltip>
        );
    }
    else {
        return (
            <span style={{ fontSize: '8px', whiteSpace: 'nowrap', color: 'silver' }}>
                { keyListVariant }
            </span>
        );
    }
}


// --------------------------------------------------------------------------------
export const getColors = (theme: Theme, isRgbValue?:boolean) => {
    const palette = theme.palette;

    const color = {
        primary: palette.primary.main,
        secondary: palette.secondary.main,
        error: palette.error.main,
        success: palette.success.main,
        info: palette.info.main,
        warning: palette.warning.main,
        textPrimary: palette.text.primary,
        textSecondary: palette.text.secondary
    }

    return Object.keys(color).map((key) => {
        return {
            label: <div style={ { width: '20px', height: '20px', background: color[key] } }/>,
            id: isRgbValue ? color[key] : key
        }
    });
}
export const fabrickStyleScheme = (listType: 'flex' | 'text', sourceStyle: any) => {
    const listTypes = { flex:flexOptions, text:textOptions }[listType];
    const result: Schema[] = [];

    Object.keys(listTypes??{}).forEach((key, index) => {
        const data = listTypes[key];            // значение из option

        
        if(key === 'margin') {
            const arr = ['marginTop', 'marginLeft', 'marginRight', 'marginBottom'].map((key)=> ({
                id: key,
                type: 'slider',
                label: key,
                value: parseStyleValue(sourceStyle[key]).number ?? 0,
                unit: '%',
                max: 100,
                min: 0,
                step: 1,
                labelSx: {
                    fontSize: '12px',
                },
            }));

            result.push(...arr);
        }
        // списки, диапазоны
        else if (Array.isArray(data)) {
            const length = listTypes[key].length;
            let schema: Schema;

            // диапазон
            if (typeof data[0] === 'number') {
                const parseValue = parseStyleValue(sourceStyle[key]);

                schema = {
                    id: key,
                    type: 'slider',
                    label: key,
                    value: parseValue.number,
                    unit: parseValue.unit,
                    labelSx: {
                        fontSize: '12px',
                    },
                    min: data[0],
                    max: data[1]
                }
            }
            // списки
            else {
                if(key === 'fontFamily') {
                    schema = {
                        id: key,
                        type: 'autocomplete',
                        label: key,
                        value: sourceStyle[key],
                        labelSx: {
                            fontSize: '12px',
                        },
                        styles: {
                            icon: {fontSize: '10px'},
                            form: {fontSize: '14px'}
                        },
                        options: globalThis.FONT_OPTIONS 
                    }
                }
                else schema = {
                    id: key,
                    type: 'toggle',
                    label: key,
                    value: sourceStyle[key],
                    labelSx: {
                        fontSize: '12px',
                    },
                    items: listTypes[key].map((label, id) => ({
                        label: decorize(key, label),
                        id: label
                    }))
                }
            }

            result.push(schema);
        }
        // все что должно потом в строку перейти с 'px' или '%'
        else if (data === 'number') {
            const parseValue = parseStyleValue(sourceStyle[key]);
            const schema = {
                id: key,
                type: 'number',
                label: key,
                value: parseValue.number,
                unit: parseValue.unit,          // ! не забыть подставить в выходное
                labelSx: {
                    fontSize: '12px',
                },
            }

            result.push(schema);
        }
        // выбор цвета
        else if (data === 'color') {
            const schema = {
                id: key,
                type: 'color',
                label: key,
                value: sourceStyle[key],
                labelSx: {
                    fontSize: '12px',
                },
            }

            result.push(schema);
        }
        // текстовое значение (можно расширить)
        else if (data === 'string') {
            const schema = {
                id: key,
                type: 'text',
                label: key,
                value: sourceStyle[key],
                labelSx: {
                    fontSize: '12px',
                },
            }

            result.push(schema);
        }
    });

    return result;
}
/** [?] `stylesScheme` - styles props, `source` - данные которые уже есть в styles */ 
export const stylesFabricScheme = (type: RegistreTypeComponent, source: Record<string, any>) => {
    const result: AccordionScnema[] = [];
    const stylesScheme: Record<string, any> = metaProps[type]?.styles ?? {};


    Object.keys(stylesScheme).forEach((keyStyle) => {
        const curentStyles = stylesScheme[keyStyle];
        const acordeon: AccordionScnema = {
            id: keyStyle,
            label: keyStyle,
            scheme: []
        };
        
        Object.keys(curentStyles).forEach((key) => {
            const data = curentStyles[key]; 

            if(typeof data === 'object' && data !== null && !Array.isArray(data)) {
                let parseValue = source?.[keyStyle]?.[key] ?? '';

                if(data.type === 'slider') {
                    if(!parseValue) parseValue = 0;
                    else parseValue = +parseValue;
                }
                if(data?.type === 'toggle') {
                    data.items = data.items.map((elem)=> ({
                        id: elem.id,
                        label: ( 
                            <span style={{ fontSize: '10px', whiteSpace: 'nowrap', color: 'gray' }}>
                                { elem.label }
                            </span>
                        )
                    }))
                }

                const schema = {
                    ...data,
                    id: key,
                    label: key,
                    //unit: parseValue.unit,
                    value: parseValue,
                    labelSx: {
                        fontSize: '12px',
                    },
                }

                acordeon.scheme.push(schema);
            }
            else if(Array.isArray(data)) {
                const length = curentStyles[key].length;
                let schema: Schema;

                // диапазон
                if (typeof data[0] === 'number') {
                    const parseValue = source?.[keyStyle]?.[key] ?? 0;

                    schema = {
                        id: key,
                        type: 'slider',
                        label: key,
                        value: parseValue,
                        //unit: parseValue.unit,
                        labelSx: {
                            fontSize: '12px',
                        },
                        min: data[0],
                        max: data[1]
                    }
                }
                // списки
                else {
                    schema = {
                        id: key,
                        type: 'toggle',
                        label: key,
                        value: source?.[keyStyle]?.[key] ?? '',
                        labelSx: {
                            fontSize: '12px',
                        },
                        items: curentStyles[key].map((label, id) => ({
                            label: decorize(key, label),
                            id: label
                        }))
                    }
                }

                acordeon.scheme.push(schema);
            }
        });

        result.push(acordeon);
    });

    return result;
}



/**
 * ФАБРИКА КОНСТРУИРУЕТ ФОРМЫ ДЛЯ ПРОПСОВ основываясь на распостраненных именах пропсов
 * @param type 
 * @param defaultValue 
 * @param typeProps 
 * @returns 
 */
export const fabrickUnical = (propName: string, propValue:any, theme, typeComponent?:RegistreTypeComponent) => {
    Object.keys(displayIcons).map((key) => {
        displayIcons[key] = (
            <Tooltip title={key} placement="top" arrow >
                { displayIcons[key] }
            </Tooltip>
        )
    });

   
    if (propName === 'color' || propName.includes('color-') || propName.includes('-color')) {
        return {
            type: 'toggle',
            id: propName,
            items: getColors(theme, typeComponent === 'Tabs'),
            label: propName,
            value: propValue,
            labelSx: { fontSize: '14px' },
            //style: { height: 36 },
        }
    }
    else if (propName === 'size') {
        const items = [
            { id: 'small', label: <var style={{ fontStyle: 'italic' }} > sm </var> },
            { id: 'medium', label: <var style={{ fontWeight: 400 }}> md </var> },
            { id: 'large', label: <var style={{ fontWeight: 'bold' }}> lg </var> }
        ];
        if(typeComponent === 'Button' || typeComponent === 'IconButton') {
            items.unshift({
                id: 'mini', 
                label: <var style={{ fontStyle: 'italic' }} > mini </var>
            });
        }

        return {
            type: 'toggle',
            id: propName,
            items: items,
            label: propName,
            value: propValue,
            labelSx: { fontSize: '14px' },
            style: { maxHeight: 32, height: 32 },
        }
    }
    else if (propName === 'delay') {
        return {
            type: 'number',
            id: propName,
            label: propName,
            value: propValue,
            min: 1,
            max: 60,
            step: 1,
            labelSx: { fontSize: '14px' }
        }
    }
    else if (propName === 'display' || propName === 'labelPosition') {
        return {
            type: 'toggle',
            id: propName,
            label: propName,
            labelSx: { fontSize: '14px' },
            value: propValue,
            items: ['none', 'left', 'right', 'column'].map((key) => ({
                id: key,
                label: displayIcons[key]
            }))
        }
    }
    else if (['icon', 'endIcon', 'startIcon', 'leftIcon', 'rightIcon'].includes(propName)) {
        const items = Object.keys(iconsList).map((key) => {
            const Render = iconsList[key];

            return ({
                id: key,
                label: <Render />
            })
        });
        items.unshift({
            id: 'none',
            label: <span style={{ fontSize: '10px', whiteSpace: 'nowrap', color: 'gray' }}>✖️</span>
        });

        return {
            type: 'toggle',
            id: propName,
            label: propName,
            isColapsed: true,
            style: {height: 30},
            labelSx: { fontSize: '14px' },
            value: propValue,
            items: items
        }
    }
    else if(propName === 'iconName') {
        const mapItems = Object.entries(fill).map(([key, value]) => {
            const Tag = value;
            
            return {
                id: key,
                label: <Tag/>
            }
        });

        return {
            type: 'toggle',
            id: propName,
            items: mapItems,
            label: propName,
            value: propValue,
            labelSx: { fontSize: '14px' }
        }
    }
    // индвивидуальные пропсы для типов
    else if(typeComponent && metaProps[typeComponent]?.[propName]) {
        const vars = metaProps[typeComponent][propName];
        
        if(Array.isArray(vars)) {
            const type = vars.length < 5 ? 'toggle' : 'select';

            const result = {
                type: type,
                id: propName,
                label: propName,
                labelSx: { fontSize: '14px' },
                value: propValue,
                items: vars.map((key) => ({
                    id: key,
                    label: (
                        <>
                            { type === 'select' && <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{key}</span>}
                            { type === 'toggle' && <span style={{ fontSize: '8px', whiteSpace: 'nowrap' }}>{key}</span>}
                        </>
                    )
                }))
            }

            if(type === 'select') result.onlyId = true;
            return result;
        }
        else if (typeof vars === 'object' && vars !== null) {
            const data = { ...vars };

            if (vars.type === 'slider') {
                if (!propValue) propValue = 0;
                else propValue = +propValue;
            }
            else if (vars?.type === 'toggle') {
                data.items = vars.items.map((elem) => ({
                    id: elem.id,
                    label: (
                        <span style={{ fontSize: '10px', whiteSpace: 'nowrap', color: 'gray' }}>
                            { elem.label }
                        </span>
                    )
                }));
            }

            return({
                ...data,
                id: propName,
                label: propName,
                value: propValue,
                labelSx: {
                    fontSize: '12px',
                },
            });
        }
    }
}