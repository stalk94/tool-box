import React, { useState, useMemo } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import context from './context';
import { useHookstate } from "@hookstate/core";


const MyEditor = ({ value, onChange, idLayout }) => {
    const editor = useMemo(() => withReact(createEditor()), []);
    
    const init =()=> {
        const def = {
            type: 'paragraph',
            children: [{ text: '' }],
        }
        if(typeof value === 'string' ) def.children[0].text = value;

        return [def];
    }
    const handleChange = (newValue: any) => {
        //console.log('editor: ', newValue);
        onChange && onChange(newValue);
    }


    return (
        <Slate 
            editor={editor} 
            initialValue={init()}
            onChange={handleChange}
        >
            <Editable placeholder="текст" />
        </Slate>
    );
}



export default MyEditor;