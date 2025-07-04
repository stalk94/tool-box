import React from "react";
import { Box, Typography, Divider, Chip } from "@mui/material";
import { editorContext, infoSlice, cellsSlice } from "../context";
import { ComponentSerrialize } from '../type';
import { TextInput, CheckBoxInput, NumberInput, SliderInput, ToggleInput, SelectInput, ColorInput } from 'src/index';
import { CgBorderStyleSolid } from "react-icons/cg";
import { RxBorderDotted } from "react-icons/rx";
import { RxBorderDashed } from "react-icons/rx";
import { RxValueNone } from "react-icons/rx";


export default function ({ category }) {
    const types = ['standart', 'form', ''];
    const select = editorContext.currentCell.use();

    const mergeProps = (key: string, value: any) => {
        const clone = structuredClone(editorContext.currentCell.get());
        if (!clone) return;

        if (!clone.props) clone.props = { [key]: value };
        else if(typeof value !== 'object') clone.props[key] = value;
        else clone.props[key] = { ...clone.props[key], ...value };

        ['lg', 'md', 'sm', 'xs'].forEach((breackpoint) =>
            editorContext.layouts[breackpoint]?.set((prev) => {
                const findex = prev.findIndex((lay)=> lay.i === select.i);
                if(findex !== -1) prev[findex].props = clone.props;
            })
        );
        editorContext.currentCell.set(clone);
    }
    const setNested = (orientation: 'vertical' | 'horizontal' | 'none', count: number) => {
        const curCell = editorContext.currentCell.get();
        const cells = cellsSlice.get(true);
        const old = cells[curCell.i];

        if (!old) return;

        cellsSlice.set((prev) => {
            if (orientation === 'none') {
                // Убрать вложенность
                prev[curCell.i] = Array.isArray(old[0]) ? old[0] : [];
            } 
            else {
                if (Array.isArray(old[0])) {
                    // Уже есть вложенность — просто добавляем новые пустые блоки
                    let newNested = [...(old as ComponentSerrialize[][])];
                    
                    if (count < newNested.length) {
                        newNested = newNested.slice(0, count);
                    } 
                    else if (count > newNested.length) {
                        for (let i = 0; i < count - newNested.length; i++) {
                            newNested.push([]);
                        }
                    }

                    prev[curCell.i] = newNested;
                } 
                else {
                    // Нет вложенности — создаём новые блоки, старое содержимое в первый
                    const newNested: ComponentSerrialize[][] = [old, ...Array.from({ length: count - 1 }, () => [])];
                    prev[curCell.i] = newNested;
                }
            }

            return prev;
        });
    }
    const setMetaName = React.useCallback((name: string) => {
        if (!select) return;
        if (name.length < 3) return;

        mergeProps('data-group', name);
    }, [select])
    

    if (category === 'all') return (
        <>
            <TextInput
                disabled={!select.i}
                label='meta name:'
                position='column'
                labelSx={{ fontSize: 14 }}
                style={{ maxHeight: 14, height: 16 }}
                value={select?.props?.["data-group"] ?? select.i}
                onChange={setMetaName}
            />
            <SelectInput
                label='type:'
                position='column'
                labelSx={{ fontSize: 14 }}
                style={{ maxHeight: 14, height: 16 }}
                value={select?.props?.type ?? 'standart'}
                items={types.map((v)=> ({id: v, label:v}))}
                onChange={(val)=> mergeProps('type', val.id)}
            />
            <ToggleInput
                label='split:'
                position='column'
                labelSx={{ fontSize: 14 }}
                style={{ height: 26 }}
                value={select?.props?.nested?.sizes?.length ?? 'none'}
                onChange={(val) => {
                    const count = +val;

                    setNested('horizontal', count);
                    mergeProps('nested', {
                        ...select?.props?.nested, 
                        orientation: 'horizontal',
                        sizes: Array(count).fill(100/count)
                    });
                }}
                items={[
                    { id: '2', label: <span style={{ fontSize: '14px' }}>x2</span> },
                    { id: '3', label: <span style={{ fontSize: '12px' }}>x3</span> },
                    { id: '4', label: <span style={{ fontSize: '12px' }}>x4</span> },
                ]}
            />
        </>
    );
    else return (
        <>
            <SliderInput
                label='elevation:'
                position='column'
                labelSx={{ fontSize: 14 }}
                max={12}
                min={0}
                value={select?.props?.elevation ?? 0}
                onChange={(val)=> mergeProps('elevation', val)}
            />
            <SliderInput
                label='padding:'
                position='column'
                labelSx={{ fontSize: 14 }}
                max={64}
                min={0}
                value={select?.props?.style?.padding ?? 0}
                onChange={(val)=>
                    mergeProps('style', {...select?.props?.style, padding: val})
                }
            />
            <SliderInput
                label='round:'
                position='column'
                labelSx={{ fontSize: 14 }}
                max={44}
                min={0}
                value={select?.props?.style?.borderRadius ?? 0}
                onChange={(val)=>
                    mergeProps('style', {...select?.props?.style, borderRadius: val})
                }
            />
            <ColorInput
                label='background:'
                position='column'
                labelSx={{ fontSize: 14 }}
                max={12}
                min={0}
                value={select?.props?.style?.backgroundColor ?? '#00000000'}
                onChange={(val)=> {
                    mergeProps('style', {...select?.props?.style, backgroundColor: val})}
                }
            />
            <ToggleInput
                label='blur:'
                position='column'
                labelSx={{ fontSize: 14 }}
                style={{ height: 26 }}
                value={select?.props?.style?.backdropFilter ?? 'none'}
                onChange={(val) =>
                    mergeProps('style', {...select?.props?.style, backdropFilter: val})
                }
                items={[
                    { id: 'none', label: <span style={{ fontSize: '14px' }}><RxValueNone /></span> },
                    { id: 'blur(4px)', label: <span style={{ fontSize: '12px' }}>x4</span> },
                    { id: 'blur(8px)', label: <span style={{ fontSize: '12px' }}>x8</span> },
                    { id: 'blur(16px)', label: <span style={{ fontSize: '12px' }}>x16</span> }
                ]}
            />

            <Divider variant='fullWidth' sx={{mt:2}}>
                <Typography variant='caption'>
                    border style
                </Typography>
            </Divider>
            <ToggleInput
                label='style:'
                position='column'
                labelSx={{ fontSize: 14 }}
                style={{ height: 26 }}
                value={select?.props?.style?.borderStyle ?? 'none'}
                onChange={(val) =>
                    mergeProps('style', {...select?.props?.style, borderStyle: val})
                }
                items={[
                    { id: 'none', label: <span style={{ fontSize: '14px' }}><RxValueNone /></span> },
                    { id: 'solid', label: <span style={{ fontSize: '14px' }}><CgBorderStyleSolid/></span> },
                    { id: 'dashed', label: <span style={{ fontSize: '14px' }}><RxBorderDashed/></span> },
                    { id: 'dotted', label: <span style={{ fontSize: '14px' }}><RxBorderDotted/></span> }
                ]}
            />
            <ColorInput
                label='color:'
                position='column'
                labelSx={{ fontSize: 14 }}
                max={12}
                min={0}
                value={select?.props?.style?.borderColor ?? '#00000000'}
                onChange={(val)=> {
                    mergeProps('style', {...select?.props?.style, borderColor: val})}
                }
            />
            <SliderInput
                label='width:'
                position='column'
                labelSx={{ fontSize: 14 }}
                max={12}
                min={0}
                value={select?.props?.style?.borderWidth ?? 0}
                onChange={(val)=>
                    mergeProps('style', {...select?.props?.style, borderWidth: val})
                }
            />
        </>
    );
}