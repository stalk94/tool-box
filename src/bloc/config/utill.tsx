import React from "react";
import { Theme, Tooltip } from "@mui/material";
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight, LinearScale,  
    ViewColumn, ViewList, ViewQuilt, ViewArray, ViewCarousel, ViewComfy, ViewCompact, 
    ViewModule, ViewAgenda, Widgets
} from "@mui/icons-material";
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
export const getColors = (theme: Theme) => {
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
        id: key
    }
    });
}
export const fabrickStyleScheme = (listType: 'flex' | 'text', sourceStyle: any) => {
    const listTypes = { flex:flexOptions, text:textOptions }[listType];
    const result: Schema[] = [];

    Object.keys(listTypes).forEach((key, index) => {
        const data = listTypes[key];            // значение из option

        // списки, диапазоны
        if (Array.isArray(data)) {
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
                schema = {
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
 * ФАБРИКА КОНСТРУИРУЕТ ФОРМЫ ДЛЯ ПРОПСОВ
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


    if (propName === 'color') {
        return {
            type: 'toggle',
            id: propName,
            items: getColors(theme),
            label: propName,
            value: propValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if (propName === 'size') {
        return {
            type: 'toggle',
            id: propName,
            items: [
                { id: 'small', label: <var style={{ fontStyle: 'italic' }} > sm </var> },
                { id: 'medium', label: <var style={{ fontWeight: 400 }}> md </var> },
                { id: 'large', label: <var style={{ fontWeight: 'bold' }}> lg </var> }
            ],
            label: propName,
            value: propValue,
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
            labelSx: { fontSize: '14px' },
            value: propValue,
            items: items
        }
    }
    else if(typeComponent && metaProps[typeComponent]?.[propName]) {
        const vars: [] | string = metaProps[typeComponent][propName];
        
        if(vars === 'string') {

        }
        else if(Array.isArray(vars)) {
            const type = vars.length < 5 ? 'toggle' : 'select';

            const result = {
                type: type,
                id: propName,
                label: propName,
                labelSx: { fontSize: '10px' },
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

            if(type==='select') result.onlyId = true;
            return result;
        }
    }
}



// ---------------------------------------------------------------------------------
// ! снести
export const utill = {
    getSize(element: Element) {
        const bound = element.getBoundingClientRect();
        return {
            height: bound.height,
            width: bound.width
        };
    },
    getPos(element: Element) {
        const bound = element.getBoundingClientRect();
        return {
            x: bound.x,
            y: bound.y
        };
    },
    getOverlap(el1: HTMLElement, el2: HTMLElement) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
    
        const x_overlap = Math.max(
            0,
            Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left)
        );
        const y_overlap = Math.max(
            0,
            Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top)
        );
    
        const area = x_overlap * y_overlap;
    
        return {
            x_overlap,
            y_overlap,
            area,
            hasCollision: area > 0
        };
    }
}



/**
 * export const fabrickPropsScheme = (type: RegistreTypeComponent, defaultValue: any, typeProps: PropsTypesEditor) => {
    const alightsIcons = {
        left: <FormatAlignLeft />,
        center: <FormatAlignCenter />,
        right: <FormatAlignRight />,
        justify: <FormatAlignJustify />
    }
    const displayIcons = {
        initial: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}> init </span>,
        block: <LinearScale />,
        inline: <ViewColumn />,
        'inline-block': <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>in -b </span>,
        flex: <Widgets />,
        'inline-flex': <ViewList />,
        grid: <ViewQuilt />,
        'inline-grid': <ViewArray />
    }
    Object.keys(displayIcons).map((key) => {
        displayIcons[key] = (
            <Tooltip title={key} placement="top" arrow >
                { displayIcons[key] }
            </Tooltip>
        )
    });


    if (typeProps === 'children' && typeof defaultValue === 'string') {
        return {
            type: 'text',
            id: typeProps,
            multiline: true,
            value: defaultValue,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
    else if (['src', 'alt', 'sizes'].includes(typeProps)) {
        return {
            type: 'text',
            id: typeProps,
            multiline: true,
            value: defaultValue,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
    else if (typeProps === 'color') {
        return {
            type: 'toggle',
            id: typeProps,
            items: '',
            label: typeProps,
            value: defaultValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if (typeProps === 'variant') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: metaProps[type]?.[typeProps]?.map((key) => ({
                id: key,
                label: <span style={{ fontSize: '10px', whiteSpace: 'nowrap' }} >{key}</span>
            }))
        }
    }
    else if (typeProps === 'size') {
        return {
            type: 'toggle',
            id: typeProps,
            items: [
                {
                    id: 'small', label: <var style={{ fontStyle: 'italic' }} > sm </var>
                },
                { id: 'medium', label: <var style={{ fontWeight: 400 }}> md </var> },
                { id: 'large', label: <var style={{ fontWeight: 'bold' }}> lg </var> }
            ],
            label: typeProps,
            value: defaultValue,
            labelSx: { fontSize: '14px' }
        }
    }
    else if (typeProps === 'display' || typeProps === 'labelPosition') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: metaProps[type]?.[typeProps]?.map((key) => ({
                id: key,
                label: displayIcons[key]
            }))
        }
    }
    else if (typeProps === 'align') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: metaProps[type]?.[typeProps]?.map((key) => ({
                id: key,
                label: alightsIcons[key]
            }))
        }
    }
    else if (typeProps === 'fullWidth') {
        return {
            type: 'switch',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
        }
    }
    else if (typeProps === 'type') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: metaProps[type]?.[typeProps]?.map((key) => ({
                id: key,
                label: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }} > {key} </span>
            }))
        }
    }
    else if (['icon', 'endIcon', 'startIcon', 'leftIcon'].includes(typeProps)) {
        const r = Object.keys(iconsList).map((key) => {
            const Render = iconsList[key];

            return ({
                id: key,
                label: <Render />
            })
        });
        r.unshift({
            id: 'none',
            label: <span style={{ fontSize: '10px', whiteSpace: 'nowrap', color: 'gray' }}>✖️</span>
        });

        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: r

        }
    }
    else if (['min', 'max', 'step'].includes(typeProps)) {
        return {
            type: 'number',
            id: typeProps,
            value: defaultValue,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }
    }
}
 */