import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import { ColorPickerCompact } from '@components/input/color';
import { Box, MenuItem, Select, Stack, IconButton, Divider } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Title, FormatListBulleted, FormatListNumbered, 
    FormatQuote, FormatColorText, FormatColorFill, InsertLink, FormatAlignLeft, FormatAlignCenter, 
    FormatAlignRight, FormatAlignJustify,
    FormatStrikethrough, Delete
} from '@mui/icons-material';



const SIZES = [
    '10px',
    '12px',
    '14px',
    '16px',
    '18px',
    '24px'
]

export default function BubbleFormattingMenu({ editor }: { editor: Editor }) {
    if (!editor) return null;


    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
        >
        <Box
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.5, 
                border: '1px solid #ffffff38',
                py: 1,
                borderRadius: 1,
                background: '#373636c0'
            }}
            //onPointerEnter={() => context.dragEnabled.set(false)}
            //onPointerLeave={() => context.dragEnabled.set(true)}
        >
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    pb: 0.5,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                }}
            >
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()}>
                        <FormatBold sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()}>
                        <FormatItalic sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                        <FormatUnderlined sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().toggleStrike().run()}>
                        <FormatStrikethrough sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" 
                        onClick={() => {
                            const previousUrl = editor.getAttributes('link').href || '';
                            const url = window.prompt('Вставьте ссылку', previousUrl);

                            if (url === null) return; // пользователь нажал Cancel

                            if (url === '') {
                                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                            }
                            else {
                                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                            }
                        }}
                    >
                        <InsertLink sx={{ fontSize: 20 }} />
                    </IconButton>
                    <Divider orientation="vertical" flexItem sx={{pl:2,pr:1}} />
                    <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('left').run()}>
                        <FormatAlignLeft sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('center').run()}>
                        <FormatAlignCenter sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('right').run()}>
                        <FormatAlignRight sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
                        <FormatAlignJustify sx={{ fontSize: 18 }} />
                    </IconButton>
    
            </Stack>
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    pt: 0.5,
                    borderTop: '1px dotted #d0cdcd29',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                }}
            >
                <ColorPickerCompact
                    onChange={(color) =>
                        editor.chain().focus().setColor(color).run()
                    }
                    style={{ width: 24, height: 26, marginLeft:7, marginRight: 4 }}
                />

                <Select style={{ marginRight: '5px',height: 28 }}
                    size="small"
                    onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
                    value={editor.getAttributes('fontSize').size || ''}
                    displayEmpty
                    sx={{ fontSize: 10, color: '#ccc', background: '#2a2a2a' }}
                >
                    <MenuItem value="" disabled>size</MenuItem>
                    {SIZES.map((size) => (
                        <MenuItem key={size} value={size}>
                            { size }
                        </MenuItem>
                    ))}
                </Select>
                <Select style={{marginRight: '5px',height: 28}}
                    size="small"
                    value={editor.getAttributes('fontFamily').family || ''}
                    onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                    displayEmpty
                    sx={{ fontSize: 10, color: '#ccc', background: '#2a2a2a' }}
                >
                    <MenuItem value="" disabled>none</MenuItem>
                    {globalThis.FONT_OPTIONS.map((font) => (
                        <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                            { font }
                        </MenuItem>
                    ))}
                </Select>
                
                <IconButton style={{marginLeft:'auto'}} size="small" onClick={() => editor.chain().focus().unsetColor().run()}>
                    <Delete sx={{ fontSize: 20 }} />
                </IconButton>
            
            </Stack>
            </Box>
        </BubbleMenu>
    );
}