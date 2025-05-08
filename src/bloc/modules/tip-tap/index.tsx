import React from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Variable } from './extension/variable';
import BubbleMenuText from './BubbleMenu';
import { useEditorContext } from '@bloc/context';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize, FontFamily } from './extension/fonts';
import Link from '@tiptap/extension-link';
import { JSONContent } from '@tiptap/react';
import { generateHTML } from '@tiptap/html';


type PropsEditor =  { 
    value: JSONContent; 
    onChange: (html: JSONContent) => void; 
    readOnly?: boolean; 
    placeholder?: string;
    className?: string;
    isEditable?: boolean;
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
    readOnly = false, 
    placeholder = '',
    className,
    isEditable = true,
    initialInsert,
}: PropsEditor) {
    const context = useEditorContext();
    const extension = [
        StarterKit.configure({
            strike: false,
        }),
        Variable, 
        TextStyle, 
        Color, 
        Highlight, 
        FontSize, 
        FontFamily, 
        Underline,
        Strike,
        Link.configure({
            openOnClick: false, // отключаем переход при клике в редакторе
            autolink: false,
            linkOnPaste: false,
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
    ];


    if (!isEditable) {
        const html = generateHTML(value, extension);

        return (
            <div
                className={className}
                dangerouslySetInnerHTML={{ __html: html }}
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
    });
    React.useEffect(() => {
        if (editor && editor.isEmpty && !value?.trim() && initialInsert) {
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
            onFocus={()=> context.dragEnabled.set(false)}
            onBlur={() => context.dragEnabled.set(true)}
        >
            <EditorContent editor={editor} />
            <BubbleMenuText editor={editor} />
        </div>
    );
}