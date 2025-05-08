import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { VariableView } from '../VariableView'; // путь к твоему компоненту


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
        };
    },

    parseHTML() {
        return [{ tag: 'span[data-variable]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(HTMLAttributes, {
                'data-variable': HTMLAttributes.name,
            }),
            `{{${HTMLAttributes.name}}}`,
        ];
    },

    renderText({ node }) {
        return `{{${node.attrs.name}}}`;
    },

    addNodeView() {
        return ReactNodeViewRenderer(VariableView);
    },
});