import React from 'react';
import { FloatingMenu, BubbleMenu, Editor } from '@tiptap/react';
import { ColorPickerCompact } from '@components/input/color';
import { Box, MenuItem, Select, Stack, IconButton, Divider } from '@mui/material';
import {
    FormatBold, FormatItalic, FormatUnderlined, Title, FormatListBulleted, FormatListNumbered,
    FormatQuote, SettingsBackupRestore, InsertLink, FormatAlignLeft, FormatAlignCenter,
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
];
const Cselect = ({ onChange, items, value, placeholder }) => {
    const [open, setOpen] = React.useState(false);
    
    
    return (
        <div style={{ position: 'relative' }}>
            <div className='Select'
                style={{
                    border: '1px solid #ccc',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    background: '#2a2a2a',
                    color: '#fff',
                    fontSize: 11,
                    borderRadius: 4
                }}
                
                onClick={()=> setOpen(!open)}
            >
                {value || placeholder}
            </div>

            {open && (
                <div
                    style={{
                        position: 'fixed',
                        background: '#333',
                        border: '1px solid #555',
                        zIndex: 1000,
                       
                    }}
                >
                    {items.map((size) => (
                        <div className='Select'
                            key={size}
                            onMouseDown={(e) => {
                                e.preventDefault(); // не теряем выделение
                                setOpen(false);
                                onChange(size);
                            }}
                            style={{
                                padding: '4px 8px',
                                cursor: 'pointer',
                                fontSize: 12,
                                color: '#fff',
                            }}
                        >
                            { size }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export default function BubbleFormattingMenu({ editor }: { editor: Editor }) {
    if (!editor) return null;
    const [coords, setCoords] = React.useState({ top: 0, left: 0, visible: false });
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    
    
    React.useEffect(() => {
        if(!editor) return;

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
            const isInPrime = target.closest('.p-overlaypanel') || target.closest('.Select');
            
            if (!isInEditor && !isInMenu && !isInMUI && !isInPrime) {
                setCoords((prev) => ({ ...prev, visible: false }));
            }
        };
        const handleBlur = (data) => {
            const isColor = data.event?.relatedTarget?.closest('.react-colorful__interactive');
            if (!isColor) setCoords((prev) => ({ ...prev, visible: false }));
        };

        document.addEventListener('mousedown', handleClickOutside);
        editor.on('selectionUpdate', update);
        editor.on('blur', handleBlur);

        return () => {
            editor.off('selectionUpdate', update);
            editor.off('blur', handleBlur);
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
                        pt: 1,
                        borderTop: '1px dotted #d0cdcd29',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        maxWidth: '100%',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <ColorPickerCompact variant='custom'
                        value={editor.getAttributes('textStyle')?.color ?? undefined}
                        onChange={(color) => {
                            editor.chain().focus().setColor(color).run()
                        }}
                        style={{ width: 24, height: 26, marginLeft: 7, marginRight: 4 }}
                    />

                    <Cselect
                        value={editor.getAttributes('fontSize').size || ''}
                        onChange={(value) => {
                            editor.chain().focus().setFontSize(value).run();
                        }}
                        items={SIZES}
                        placeholder='size'
                        style={{
                            fontSize: 10,
                            padding: 4,
                            borderRadius: 4,
                            border: '1px solid #ccc',
                            background: '#2a2a2a',
                            color: '#fff',
                            pointerEvents: 'auto'
                        }}
                    />
                    <Cselect style={{ marginRight: '5px', height: 28 }}
                        value={editor.getAttributes('fontFamily').family || ''}
                        onChange={(value) => editor.chain().focus().setFontFamily(value).run()}
                        placeholder='family'
                        items={globalThis.FONT_OPTIONS}
                    />

                    <IconButton style={{ marginLeft: 'auto' }} 
                        size="small" 
                        onClick={() => {
                            editor.chain().focus()
                                .unsetAllMarks()
                                .unsetColor()
                                .setFontSize(null)
                                .setFontFamily(null)
                                .run();
                        }}
                    >
                        <SettingsBackupRestore sx={{ fontSize: 20 }} />
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