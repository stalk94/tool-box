import { Node, mergeAttributes } from '@tiptap/core';
//import { ReactNodeViewRenderer } from '@tiptap/react';
//import { VariableView } from '../VariableView'; // путь к твоему компоненту


export const Variable = Node.create({
    name: 'variable',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            name: {
                default: '',
            },
            rowIndex: {
                default: null,
            },
            db: {
                default: 'BASE'
            },
        };
    },

    parseHTML() {
        return [{ 
            tag: 'span[data-variable]', 
            getAttrs: el => ({
                name: (el as HTMLElement).getAttribute('data-variable'),
                rowIndex: parseInt((el as HTMLElement).getAttribute('data-row-index') || '0', 10),
            }),
        }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(HTMLAttributes, {
                'data-variable': HTMLAttributes.name,
                'data-row-index': HTMLAttributes.rowIndex,
            }),
            `{{${HTMLAttributes.name}}{${HTMLAttributes.rowIndex}}}`,
        ];
    },

    renderText({ node }) {
        return `{{${node.attrs.name}}:{${node.attrs.rowIndex}}}`;
    },

    //addNodeView() {
        //return ReactNodeViewRenderer(VariableView);
    //},
});