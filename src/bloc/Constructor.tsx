import React from "react";
import { oklchToRgba } from './helpers/dom';
import { Schema, AccordionScnema } from 'src/index';
import { daisyColors, daisyButtonsVariant } from './config/theme';
import { iconsList } from 'src/components/tools/icons';
import metaProps from './config/props';
import { Source, Bookmark, HMobiledata, Circle, CropSquare, Square } from "@mui/icons-material";
import { ProxyComponentName, ComponentProps } from './type';

const SwitchKeys = ['fullHeight', 'responsive', 'isDirectionColumn', 'showLabels', 'isChildren', 'isSecondary', 'isButton', 'autoplay', 'isHorizontal'];
const TextKeys = ['children', 'src', 'alt', 'sizes', 'placeholder', 'label', 'separator', 'name'];
const ToogleKeys = ['icon', 'endIcon', 'startIcon', 'leftIcon', 'rightIcon'];
const NumberKeys = ['min', 'max', 'step', 'heightMedia', 'elevation'];
const colors = ['neutral', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'];


//////////////////////////////////////////////////////////////////////////
//           clases form sceme fabric         
//////////////////////////////////////////////////////////////////////////
class Base {
    type: ProxyComponentName
    schema: Schema[]
    acSchema: AccordionScnema[]

    constructor(props: ComponentProps, type: ProxyComponentName) {
        this.type = type;
        this.schema = [{
            type: 'switch',
            id: 'fullWidth',
            label: 'fullWidth',
            labelSx: { fontSize: '12px' },
            value: props?.fullWidth
        }];
        this.acSchema = [];

        Object.entries(props).forEach(([key, value])=> 
            key !== 'fullWidth' && this.#getSchema(key, value)
        );
    }
    #getSchema(propName: string, value: any) {
        if (SwitchKeys.includes(propName)) {
            this.schema.push({
                type: 'switch',
                id: propName,
                label: propName,
                labelSx: { fontSize: '14px' },
                value: value
            });
        }
        else if (TextKeys.includes(propName)) {
            this.schema.push({
                type: 'text',
                id: propName,
                multiline: (propName === 'src' && true),
                value: value,
                label: propName,
                labelSx: { fontSize: '14px' },
                style: propName === 'src' ? {} : { maxHeight: 14, height: 16 },
                sx: { fontSize: 14 }
            });
        }
        else if (ToogleKeys.includes(propName)) {
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

            this.schema.push({
                type: 'toggle',
                id: propName,
                label: propName,
                isColapsed: true,
                style: { height: 30 },
                labelSx: { fontSize: '14px' },
                value: value,
                items: items
            });
        }
        else if (NumberKeys.includes(propName)) {
            const max = propName==='elevation' ? 12 : (propName==='heightMedia' ? 500 : undefined);
            const step = propName==='elevation' ? 1 : (propName==='heightMedia' ? 20 : undefined)

            this.schema.push({
                type: 'number',
                id: propName,
                value: value,
                label: propName,
                labelSx: { fontSize: '14px' },
                max: max,
                step: step,
                sx: { fontSize: 14 },
                style: { maxHeight: 14, height: 16 },
            });
        }
        else if (propName === 'size') {
            const items = [
                { id: 'xs', label: <var style={{ fontStyle: 'italic' }} > xs </var> },
                { id: 'sm', label: <var style={{ fontWeight: 400 }}> sm </var> },
                { id: 'md', label: <var style={{ fontWeight: 'bold' }}> md </var> },
                { id: 'lg', label: <var style={{ fontWeight: 'bold' }}> lg </var> },
                { id: 'xl', label: <var style={{ fontWeight: 'bold' }}> xl </var> }
            ];
            this.schema.push({
                type: 'toggle',
                id: propName,
                items: items,
                label: propName,
                value: value,
                labelSx: { fontSize: '14px' },
                style: { maxHeight: 32, height: 32 },
            });
        }
        else if (propName === 'delay') {
            this.schema.push({
                type: 'number',
                id: propName,
                label: propName,
                value: value,
                min: 1,
                max: 60,
                step: 1,
                labelSx: { fontSize: '14px' }
            });
        }
        else if (propName === 'data-source') {
            this.schema.push({
                type: 'file',
                id: 'file',
                label: 'upload',
                accept: value === 'table' && ".json,.csv,.xlsx,.xls",
                labelSx: { fontSize: '14px' },
                style: { maxHeight: 14, height: 16 },
                value: value,
            });
        }
        else if (this.type && metaProps[this.type]?.[propName]) {
            const vars = metaProps[this.type][propName];

            if (Array.isArray(vars)) {
                const type = vars.length < 5 ? 'toggle' : 'select';

                const result = {
                    type: type,
                    id: propName,
                    label: propName,
                    labelSx: { fontSize: '14px' },
                    value: value,
                    items: vars.map((key) => ({
                        id: key,
                        label: (
                            <>
                                {type === 'select' && <span style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{key}</span>}
                                {type === 'toggle' && <span style={{ fontSize: '8px', whiteSpace: 'nowrap' }}>{key}</span>}
                            </>
                        )
                    }))
                }

                if (type === 'select') result.onlyId = true;
                this.schema.push(result);
            }
            else if (typeof vars === 'object' && vars !== null) {
                const data = { ...vars };

                if (vars.type === 'slider') {
                    if (!value) value = 0;
                    else value = +value;
                }
                else if (vars?.type === 'toggle') {
                    data.items = vars.items.map((elem) => ({
                        id: elem.id,
                        label: (
                            <span style={{ fontSize: '10px', whiteSpace: 'nowrap', color: 'gray' }}>
                                {elem.label}
                            </span>
                        )
                    }));
                }

                this.schema.push({
                    ...data,
                    id: propName,
                    label: propName,
                    value: value,
                    labelSx: {
                        fontSize: '14px',
                    },
                });
            }
        }
    }
    static getColorTheme() {
        const container = document.querySelector('[data-theme]');
        const styles = getComputedStyle(container);
        const allVars: Record<string, string> = {};

        daisyColors.map((k)=> {
            allVars[k] = oklchToRgba(styles.getPropertyValue(k));
        });
        const result = Object.fromEntries(
            colors.map(color => {
                const key = `--color-${color}`;
                return [color, allVars[key]];
            }).filter(([, value]) => value) // убрать пустые
        );

        return(result);
    }
}
class Buttons extends Base {
    constructor(typeComponent: ProxyComponentName, props: ComponentProps) {
        super(props, typeComponent);
        this.#pushSchemaIndividual(props);
    }
    #pushSchemaIndividual(props) {
        const objColors = Base.getColorTheme();
       
        this.schema.push({
            type: 'toggle',
            id: 'color',
            items: Object.entries(objColors).map(([key, v]) => ({
                label: <div style={{ width: '20px', height: '20px', background: v }} />,
                id: key
            })),
            label: 'color',
            value: props.color ?? 'primary',
            labelSx: { fontSize: '14px' },
        });
        this.schema.push({
            type: 'toggle',
            id: 'variant',
            items: daisyButtonsVariant.map((variant) => ({
                label: <var style={{ fontStyle: 'italic', fontSize:'12px' }} >{variant}</var>,
                id: variant
            })),
            label: 'variant',
            value: props.variant ?? 'fill',
            labelSx: { fontSize: '14px' },
        });
    }
}
class Avatar {
    schema: Schema[]
    acSchema: AccordionScnema[]

    constructor(props: ComponentProps) {
        this.schema = [{
            type: 'switch',
            id: 'fullWidth',
            label: 'fullWidth',
            labelSx: { fontSize: '12px' },
            value: props?.fullWidth
        }];
        this.#pushSchemaIndividual(props);
    }
    #pushSchemaIndividual(props) {
        this.schema.push({
            type: 'number',
            id: 'sizes',
            value: props.sizes,
            min: 24,
            label: 'sizes',
            labelSx: { fontSize: '14px' },
            sx: { fontSize: 14 }
        }, {
            type: 'toggle',
            id: 'variant',
            items: [
                { id: 'circular', label: <Circle /> },
                { id: 'rounded', label: <CropSquare /> },
                { id: 'square', label: <Square /> },
            ],
            label: 'variant',
            value: props?.variant ?? 'circular',
            labelSx: { fontSize: '14px' },
            style: { height: 26 }
        }, {
            type: 'toggle',
            id: 'data-source',
            items: [
                { id: 'src', label: <Source /> },
                { id: 'icon', label: <Bookmark /> },
                { id: 'children', label: <HMobiledata /> }
            ],
            label: 'data-source',
            value: props['data-source'],
            labelSx: { fontSize: '14px' },
            style: { height: 26 }
        });

        this.schema.push({
            type: 'text',
            id: 'src',
            multiline: true,
            label: 'src',
            labelSx: { fontSize: '14px' },
            style: { maxHeight: 14, height: 16 },
            value: props.src,
        });
        this.schema.push({
            type: 'file',
            id: 'file',
            label: 'upload',
            labelSx: { fontSize: '14px' },
            value: props.src,
        });
        this.schema.push({
            type: 'text',
            multiline: true,
            id: 'children',
            label: 'children',
            style: { maxHeight: 14, height: 16 },
            labelSx: { fontSize: '14px' },
            value: props.children,
        });
    }
}


//////////////////////////////////////////////////////////////////////////
//                export    
//////////////////////////////////////////////////////////////////////////
const list = {
    IconButton: Buttons,
    Button: Buttons,
    Avatar: Avatar
}
export default function (typeComponent: ProxyComponentName, props: ComponentProps) {
    if (list[typeComponent]) {
        const constructor = new list[typeComponent](typeComponent, props);

        return ({
            schema: constructor.schema,
            acSchema: constructor.acSchema
        });
    }
    else {
        const constructor = new Base(props, typeComponent);

        return ({
            schema: constructor.schema,
            acSchema: constructor.acSchema
        });
    }
}