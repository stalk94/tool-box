import React from 'react';
import { FloatingMenu, Editor } from '@tiptap/react';
import { ColorPickerCompact } from '@components/input/color';
import { Box, MenuItem, Select, Stack, IconButton, Divider } from '@mui/material';
import {
    FormatBold, FormatItalic, FormatUnderlined, Title, FormatListBulleted, FormatListNumbered,
    FormatQuote, FormatColorText, FormatColorFill, InsertLink, FormatAlignLeft, FormatAlignCenter,
    FormatAlignRight, FormatAlignJustify,
    FormatStrikethrough, Delete
} from '@mui/icons-material';




export default function FloatingMain() {
    return (
        <FloatingMenu
            editor={editor}
            className="floating-menu"
            shouldShow={({ editor }) => editor.isFocused && editor.isEditable}
            tippyOptions={{
                duration: 100,
                placement: 'top', // можешь сменить на 'bottom', если нужно
                zIndex: 9999,
                appendTo: 'parent',
                offset: [0, 4],
            }}
        >
            
        </FloatingMenu>
    );
}