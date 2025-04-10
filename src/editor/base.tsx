'use client'
import React from 'react';
import { useHasVisibleBorder, getElementBorderStyle, getElementBoxStyle } from './hooks';
import { BaseType, FlexType, TextType, testListTypes } from './type';
import { Box, Button } from '@mui/material';
import { Schema } from '../components/form/types';
import Form from '../components/form';


// type: text
const Forms =({ type, style, onChange })=> {
    const createScheme =()=> {
        const cssStyleToObject =(style: CSSStyleDeclaration) => {
            const result: Record<string, string> = {};

            for (let i = 0; i < style.length; i++) {
                const prop = style[i]; // например "margin-top"
                const value = style.getPropertyValue(prop);
                result[prop] = value;
            }

            return result;
        }
        if(type === 'text') {
            const schemesText: Schema[] = [];
            const tStyle = cssStyleToObject(style);

            Object.keys(testListTypes).forEach((key, index)=> {
                if(Array.isArray(testListTypes[key])) {
                    const length = testListTypes[key].length;

                    const schema = {
                        id: key,
                        type: length > 4 ? 'select' : 'toggle',
                        label: key,
                        value: tStyle[key],
                        labelSx: {
                            fontSize: '14px',
                            color: '#fbd893'
                        },
                        items: testListTypes[key].map((label, id)=> ({
                            label: label,
                            id: label
                        }))
                    }
                    schemesText.push(schema);
                }
                else {
                    const schema = {
                        id: key,
                        type: 'text',
                        label: key,
                        value: tStyle[key],
                        labelSx: {
                            fontSize: '14px',
                            color: '#fbd893'
                        },
                    }
                    schemesText.push(schema);
                }
            });

            return schemesText;
        }
    }
    

    return(
        <Form
            scheme={createScheme()}
            labelPosition='column'
            onChange={onChange}
        />
    );
}



export default function ({ style, type, onChange, open }) {
    return(
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '100%',
                p: 1
            }}
        >
            
            { open && 
                <>
                    <Box 
                        sx={{
                            border: '1px dotted #f9b9807a',
                            mb: 1,
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            color: '#f18b32'
                        }}
                    >
                        { type }
                    </Box>
                    <Forms
                        style={style}
                        type={type}
                        onChange={onChange}
                    />
                </>
            }
        </Box>
    );
}