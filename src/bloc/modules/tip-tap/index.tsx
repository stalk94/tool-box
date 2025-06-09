import React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import BubbleMenuText from './BubbleMenu';
import { editorContext, infoSlice } from '@bloc/context';
import { JSONContent } from '@tiptap/react';
import JSONRenderer from './Render';
import { generateHTML } from '@tiptap/core';
import extension from './extension';



type PropsEditor = {
    value: JSONContent;
    onChange: (html: JSONContent) => void;
    onFocus?: (editor: Editor) => void;
    onBlur?: (editor: Editor) => void;
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
    isEditable?: boolean;
    autoIndex?: number;
    initialInsert?: {
        text: string;
        fontSize?: string;
        fontFamily?: string;
        fontWeight?: string;
    }
}


export default function TipTapSlotEditor({
    value,
    onChange,
    onFocus,
    onBlur,
    readOnly = false,
    placeholder = '',
    className,
    isEditable = true,
    initialInsert,
    autoIndex,
    style={}
}: PropsEditor) {
    if (!isEditable) {
        return (
            <JSONRenderer
                autoIndex={autoIndex}
                value={value}
                className={className}
            />
        );
    }

    const editor = useEditor({
        editable: !readOnly,
        extensions: extension,
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: className,
                placeholder,
            },
        },
        onFocus: ({ editor }) => {
            infoSlice.activeEditorTipTop.set(editor);
            if(onFocus) onFocus(editor);
        },
        onBlur:({ editor }) => {
            setTimeout(()=> infoSlice.activeEditorTipTop.set(undefined), 1000);
            if(onBlur) onBlur(editor);
        },
    });
    React.useEffect(() => {
        if (editor && editor.isEmpty && !value?.trim?.() && initialInsert) {
            const chain = editor.chain().focus();

            if (initialInsert.fontSize) {
                chain.setFontSize(initialInsert.fontSize);
            }
            if (initialInsert.fontFamily) {
                chain.setFontFamily(initialInsert.fontFamily);
            }
            if (initialInsert.fontWeight) {
                chain.setMark('textStyle', { fontWeight: initialInsert.fontWeight });
            }

            chain.insertContent(initialInsert.text).run();
        }
    }, [editor, value, initialInsert]);



    return (
        <div
            onFocus={() => editorContext.dragEnabled.set(false)}
            onBlur={() => editorContext.dragEnabled.set(true)}
        >
            {editor && <BubbleMenuText editor={editor} />}
            <EditorContent style={style} editor={editor} />
        </div>
    );
}



export const rendeHtml =(value: JSONContent)=> {
    const result = generateHTML(value, extension);
    const match = result.match(/^<p([^>]*)>([\s\S]*)<\/p>$/);
    
    if (match) {
        const attrs = match[1];                     // всё после <p
        const content = match[2];                   // внутренний HTML
        return `<div ${attrs}>${content}</div>`;
    }

    return  result;
}