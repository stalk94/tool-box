import React from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';

const IconView = ({ node }: any) => {
    const name = node.attrs.name;

    return (
        <NodeViewWrapper as="span" 
            data-icon={name} 
            style={{ 
                display: 'inline-block', 
                padding: '0 4px' 
            }}
        >
            { /* icon */ }
        </NodeViewWrapper >
    );
}

export const IconNode = Node.create({
    name: 'icon',
    group: 'inline',
    inline: true,
    atom: true,
    selectable: true,

    addAttributes() {
        return {
            name: { default: 'star' }, // имя иконки
        };
    },

    parseHTML() {
        return [{ tag: 'span[data-icon]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-icon': HTMLAttributes.name })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(IconView);
    },
});