import { NodeViewWrapper } from '@tiptap/react';


// ! пример
export const VariableView = ({ node }: any) => {
    const name = node.attrs.name;

    return (
        <NodeViewWrapper
            as="span"
            contentEditable={false}
            style={{
                backgroundColor: '#eef',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                userSelect: 'none',
                cursor: 'pointer',
            }}
            title={`Переменная: ${name}`}
            onClick={() => alert(`Вы кликнули по переменной "${name}"`)}
        >
            {{ name }}
        </NodeViewWrapper>
    );
}