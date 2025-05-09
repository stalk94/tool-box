import React from 'react';
import { FloatingMenu, BubbleMenu, Editor } from '@tiptap/react';
import { ColorPickerCompact } from '@components/input/color';
import { Box, MenuItem, Select, Stack, IconButton, Divider } from '@mui/material';
import {
    FormatBold, FormatItalic, FormatUnderlined, Title, FormatListBulleted, FormatListNumbered,
    FormatQuote, FormatColorText, FormatColorFill, InsertLink, FormatAlignLeft, FormatAlignCenter,
    FormatAlignRight, FormatAlignJustify,
    FormatStrikethrough, Delete
} from '@mui/icons-material';
import { createPortal } from 'react-dom';


const SIZES = [
    '10px',
    '12px',
    '14px',
    '16px',
    '18px',
    '24px'
]

export default function BubbleFormattingMenu({ editor }: { editor: Editor }) {
    const [coords, setCoords] = React.useState({ top: 0, left: 0, visible: false });
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    if (!editor) return null;


    React.useEffect(() => {
        const update = () => {
            const { state, view } = editor;
            const { from, to } = state.selection;

            if (from === to) {
                setCoords((prev) => ({ ...prev, visible: false }));
                return;
            }

            const start = view.coordsAtPos(from);
            setCoords({
                top: start.top + window.scrollY + 30,
                left: start.left + window.scrollX,
                visible: true,
            });
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            const isInEditor = editor.view.dom.contains(target);
            const isInMenu = menuRef.current?.contains(target);
            const isInMUI = target.closest('.MuiPopover-root, .MuiMenu-paper, .MuiPaper-root');
            const isInPrime = target.closest('.p-overlaypanel');

            if (!isInEditor && !isInMenu && !isInMUI && !isInPrime) {
                setCoords((prev) => ({ ...prev, visible: false }));
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        editor.on('selectionUpdate', update);

        return () => {
            editor.off('selectionUpdate', update);
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [editor]);

    if (!coords.visible) return null;
    if (editor.state.selection.from === editor.state.selection.to) {
        return null;
    }
   
    
    return createPortal(
        <div
            ref={menuRef}
            style={{
                position: 'absolute',
                top: coords.top,
                left: coords.left,
                zIndex: 1000,
            }}
            onMouseDown={(e) => e.preventDefault()}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    p: 1,
                    border: '1px solid #ffffff38',
                    background: '#262626fa',
                    borderRadius: 1
                }}
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
                    <Divider orientation="vertical" flexItem sx={{ pl: 2, pr: 1 }} />
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
                        value={editor.getAttributes('textStyle')?.color ?? undefined}
                        onChange={(color) =>
                            editor.chain().focus().setColor(color).run()
                        }
                        style={{ width: 24, height: 26, marginLeft: 7, marginRight: 4 }}
                    />

                    <Select style={{ marginRight: '5px', height: 28 }}
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
                    <Select style={{ marginRight: '5px', height: 28 }}
                        size="small"
                        value={editor.getAttributes('fontFamily').family || ''}
                        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                        displayEmpty
                        sx={{ fontSize: 10, color: '#ccc', background: '#2a2a2a' }}
                    >
                        <MenuItem value="" disabled>none</MenuItem>
                        {globalThis.FONT_OPTIONS.map((font) => (
                            <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                            </MenuItem>
                        ))}
                    </Select>

                    <IconButton style={{ marginLeft: 'auto' }} size="small" onClick={() => editor.chain().focus().unsetColor().run()}>
                        <Delete sx={{ fontSize: 20 }} />
                    </IconButton>

                </Stack>
            </Box>
        </div>,
        document.body
    );
}


/**
 *  <BubbleMenu
            className='bubble-menu'
            editor={editor}
            tippyOptions={{ 
                interactive: true,
                duration: 100,
                placement: 'bottom',
                zIndex: 9999,
                appendTo: () => document.body,
                onMount: (instance) => {
                    instance.popper.addEventListener('mousedown', (e) => {
                        const tag = (e.target as HTMLElement).tagName.toLowerCase();
                        console.log(tag)
                        if (!['button', 'input', 'select'].includes(tag)) {
                            e.preventDefault();
                        }
                    });
                }
            }}
        >
 */