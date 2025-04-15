import React from "react";
import { listConfig } from '../modules/RENDER';
import { Box, Theme, Tooltip, useTheme } from "@mui/material";
import { FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight, LinearScale,  
    ViewColumn, ViewList, ViewQuilt, ViewArray, ViewCarousel, ViewComfy, ViewCompact, ViewModule, ViewAgenda, Widgets
} from "@mui/icons-material";
import { iconsList } from '../../components/tools/icons';
import { PropsTypes } from './type';
import { Schema } from '../../index';
import { baseOptions, flexOptions, textOptions } from './style';
import { iconListStyle } from './style-icons';


// отделяет значения числовые от постфиксов
export function parseStyleValue(value?: string) {
    if (typeof value !== 'string') return { number: 0, unit: '' };

    const match = value.match(/^([\d.]+)([a-z%]*)$/);
    if (!match) return { number: 0, unit: '' };

    const [, number, unit] = match;
    return {
        number: parseFloat(number),
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
export const fabrickStyleScheme = (listType: 'base' | 'flex' | 'text', sourceStyle: any) => {
    const listTypes = { base:baseOptions, flex:flexOptions, text:textOptions }[listType];
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
/**
 * ФАБРИКА КОНСТРУИРУЕТ ФОРМЫ ДЛЯ ПРОПСОВ
 * @param type 
 * @param defaultValue 
 * @param typeProps 
 * @returns 
 */
export const fabrickPropsScheme = (type, defaultValue, typeProps: PropsTypes) => {
    const alightsIcons = {
        left: <FormatAlignLeft />,
        center: <FormatAlignCenter />,
        right: <FormatAlignRight />,
        justify: <FormatAlignJustify />
    }
    const displayIcons = {
        initial: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }
        }> init </span>,
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
                {displayIcons[key]}
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
            type: 'select',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            onlyId: true,
            value: defaultValue,
            items: listConfig[type].props[typeProps].map((key) => ({
                id: key,
                label: key
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
    else if (typeProps === 'display') {
        return {
            type: 'toggle',
            id: typeProps,
            label: typeProps,
            labelSx: { fontSize: '14px' },
            value: defaultValue,
            items: listConfig[type].props[typeProps].map((key) => ({
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
            items: listConfig[type].props[typeProps].map((key) => ({
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
            items: listConfig[type].props[typeProps].map((key) => ({
                id: key,
                label: <span style={{ fontSize: '11px', whiteSpace: 'nowrap' }} > {key} </span>
            }))
        }
    }
    else if (['icon', 'endIcon', 'startIcon'].includes(typeProps)) {
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
}

// ---------------------------------------------------------------------------------
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