import React, { useMemo, useCallback } from 'react';
import { Typography, Select, MenuItem, Divider } from '@mui/material';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Range } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { useHookstate } from '@hookstate/core';
import { updateComponentProps } from '../utils/updateComponentProps';
import { useInfoState, useEditorContext } from "../context";
import { Popover, IconButton, Stack, Tooltip, Box } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Title, FormatListBulleted, FormatListNumbered, 
    FormatQuote, FormatColorText, FormatColorFill, InsertLink, FormatAlignLeft, FormatAlignCenter, 
    FormatAlignRight, FormatAlignJustify
} from '@mui/icons-material';
import { RgbaColorPicker } from 'react-colorful';
import { useDebounced } from 'src/components/hooks/debounce';
import { withResetOnRightClick } from './utils/hooks';


const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const fallbackValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

function renderInline(inlines: any[]): React.ReactNode {
    return inlines.map((leaf, i) => {
        let el: React.ReactNode = leaf.text;

        if (leaf.bold) el = <strong key={i}>{el}</strong>;
        if (leaf.italic) el = <em key={i}>{el}</em>;
        if (leaf.underline) el = <u key={i}>{el}</u>;
        if (leaf.color) el = <span key={i} style={{ color: leaf.color }}>{el}</span>;
        if (leaf.bgcolor) el = <span key={i} style={{ backgroundColor: leaf.bgcolor }}>{el}</span>;
        if (leaf.link?.href) {
            el = <a key={i} style={{ color: leaf.color }} href={leaf.link.href} target="_blank" rel="noopener noreferrer">{el}</a>;
        }
        if (leaf.fontFamily) {
            el = <span key={i} style={{ fontFamily: leaf.fontFamily }}>{el}</span>;
        }
        if (leaf.textAlign) {
            el = <span key={i} style={{ display: 'block', textAlign: leaf.textAlign }}>{el}</span>;
        }

        return <React.Fragment key={i}>{el}</React.Fragment>;
    });
}
function renderSlateContent(blocks: Descendant[]): React.ReactNode {
    return blocks.map((block, i) => {
        if (!block) return null;

        const key = `block-${i}`;
        const children = renderInline(block.children ?? []);

        switch (block.type) {
            case 'heading-one':
                return <h2 key={key}>{children}</h2>;
            case 'bulleted-list':
                return <ul key={key}>{block.children.map((li, j) => <li key={j}>{renderInline(li.children)}</li>)}</ul>;
            case 'numbered-list':
                return <ol key={key}>{block.children.map((li, j) => <li key={j}>{renderInline(li.children)}</li>)}</ol>;
            case 'blockquote':
                return <blockquote key={key}>{children}</blockquote>;
            default:
                return <p key={key}>{children}</p>;
        }
    });
}
const AlignToggleButton = () => {
    const editor = useSlate();
    const ALIGN_MODES = ['left', 'center', 'right', 'justify'] as const;
    const ALIGN_ICONS = {
        left: FormatAlignLeft,
        center: FormatAlignCenter,
        right: FormatAlignRight,
        justify: FormatAlignJustify
    }

    const getCurrentAlign = (): typeof ALIGN_MODES[number] => {
        const marks = Editor.marks(editor);
        return marks?.textAlign ?? 'left';
    }
    const handleToggleAlign = () => {
        const current = getCurrentAlign();
        const index = ALIGN_MODES.indexOf(current);
        const next = ALIGN_MODES[(index + 1) % ALIGN_MODES.length];
        Editor.addMark(editor, 'textAlign', next);
    }

    const CurrentIcon = ALIGN_ICONS[getCurrentAlign()];


    return (
        <Tooltip title="Выравнивание текста">
            <IconButton size="small" onClick={handleToggleAlign}>
                <CurrentIcon sx={{ fontSize: 16 }} />
            </IconButton>
        </Tooltip>
    );
}

const Toolbar = () => {
    const editor = useSlate();
    const context = useEditorContext();
    const [anchorText, setAnchorText] = React.useState<HTMLElement | null>(null);
    const [anchorBg, setAnchorBg] = React.useState<HTMLElement | null>(null);
    const [colorText, setColorText] = React.useState<string>(null);
    const [colorBg, setColorBg] = React.useState<string>(null);


    const handleFontChange = (font: string) => {
        Editor.addMark(editor, 'fontFamily', font);
    }
    const toggleMark = (format: string) => {
        const isActive = isMarkActive(editor, format);
        if (isActive) {
            Editor.removeMark(editor, format);
        } 
        else {
            Editor.addMark(editor, format, true);
        }
    }
    const toggleBlock = (format: string) => {
        const isList = LIST_TYPES.includes(format);
        const isActive = isBlockActive(editor, format);

        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes(n.type as string),
            split: true,
        });

        if (isList) {
            if (!isActive) {
                Transforms.setNodes(editor, { type: 'list-item' });
                Transforms.wrapNodes(editor, {
                    type: format,
                    children: [],
                });
            } else {
                Transforms.setNodes(editor, { type: 'paragraph' });
            }
        } else {
            Transforms.setNodes(editor, {
                type: isActive ? 'paragraph' : format,
            });
        }
    }
    const isMarkActive = (editor: Editor, format: string) => {
        const marks = Editor.marks(editor);
        return marks ? marks[format] === true : false;
    }
    const isBlockActive = (editor: Editor, format: string) => {
        const [match] = Array.from(
            Editor.nodes(editor, {
                match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
            })
        );
        return !!match;
    }
    const handleColorChange = (color: { r: number, g: number, b: number, a: number }) => {
        const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        setColorText(rgba);
        Editor.addMark(editor, 'color', rgba);
    }
    const handleBgChange = (color: { r: number, g: number, b: number, a: number }) => {
        const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        setColorBg(rgba);
        Editor.addMark(editor, 'bgcolor', rgba);
    }


    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.5, 
                border: '1px solid #d0d0d02d',
                py: 1,
                borderRadius: 1,
                background: '#0d0c0c40'
            }}
            onPointerEnter={() => context.dragEnabled.set(false)}
            onPointerLeave={() => context.dragEnabled.set(true)}
        >
            {/* Первая строка: базовые стили */}
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
                <Tooltip title="Заголовок H4">
                    <IconButton size="small" onClick={() => toggleBlock('heading-one')}>
                        <Title sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Жирный">
                    <IconButton size="small" onClick={() => toggleMark('bold')}>
                        <FormatBold sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Курсив">
                    <IconButton size="small" onClick={() => toggleMark('italic')}>
                        <FormatItalic sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Подчёркнутый">
                    <IconButton 
                        size="small" 
                        onClick={() => toggleMark('underline')}
                    >
                        <FormatUnderlined sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Ссылка">
                    <IconButton style={{marginRight:'5px'}} size="small" 
                        onClick={() => {
                            const href = prompt('Вставьте ссылку:');
                            if (!href) return;

                            const { selection } = editor;
                            if (!selection || Range.isCollapsed(selection)) {
                                alert('Сначала выдели текст!');
                                return;
                            }

                            Editor.addMark(editor, 'link', { href });
                        }}
                        {...withResetOnRightClick((e) => setAnchorBg(e.currentTarget), editor, 'link')}
                    >
                        <InsertLink sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem/>
                <AlignToggleButton />

                <Tooltip style={{marginLeft:'auto'}} title="Цвет текста">
                    <IconButton 
                        size="small" 
                        onClick={(e) => setAnchorText(e.currentTarget)}
                        {...withResetOnRightClick((e) => setAnchorText(e.currentTarget), editor, 'color')}
                        sx={{ color: colorText || 'inherit' }}
                    >
                        <FormatColorText sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Фон текста">
                    <IconButton 
                        size="small" 
                        onClick={(e) => setAnchorBg(e.currentTarget)}
                        {...withResetOnRightClick((e) => setAnchorBg(e.currentTarget), editor, 'bgcolor')}
                        sx={{ color: colorBg || 'inherit' }}
                    >
                        <FormatColorFill sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* Вторая строка: структура и блоки */}
            <Stack
                direction="row"
                spacing={0.5}
                sx={{
                    pt: 0.6,
                    borderTop: '1px dotted #d0cdcd29',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    maxWidth: '100%',
                    whiteSpace: 'nowrap',
                }}
            >
                <Tooltip title="Маркированный список">
                    <IconButton size="small" onClick={() => toggleBlock('bulleted-list')}>
                        <FormatListBulleted sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Нумерованный список">
                    <IconButton size="small" onClick={() => toggleBlock('numbered-list')}>
                        <FormatListNumbered sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Цитата">
                    <IconButton size="small" onClick={() => toggleBlock('blockquote')}>
                        <FormatQuote sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Select style={{marginLeft:'auto', marginRight:'5px'}}
                    size="small"
                    value=""
                    onChange={(e) => handleFontChange(e.target.value)}
                    displayEmpty
                    sx={{ fontSize: 10, height: 30, color: '#ccc', background: '#2a2a2a'}}
                >
                    <MenuItem value="" disabled>𝓣</MenuItem>
                    { globalThis.FONT_OPTIONS.map((font) => (
                        <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Popover
                open={Boolean(anchorText)}
                anchorEl={anchorText}
                onClose={() => setAnchorText(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ p: 2 }}>
                    <RgbaColorPicker onChange={handleColorChange} />
                </Box>
            </Popover>

            <Popover
                open={Boolean(anchorBg)}
                anchorEl={anchorBg}
                onClose={() => setAnchorBg(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ p: 2 }}>
                    <RgbaColorPicker onChange={handleBgChange} />
                </Box>
            </Popover>
        </Box>
    );
}



// ! не сохраняются изменения стилей
export const TextWrapper = React.forwardRef((props: any, ref) => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [isEditing, setIsEditing] = React.useState(false);
    const { children, ['data-id']: dataId, ...otherProps } = props;
    const componentRef = React.useRef(props);
    const context = useEditorContext();
    const infoState = useInfoState();
    const selected = useHookstate(infoState.select);

    const [value, setValue] = React.useState<Descendant[]>(() => {
        if (Array.isArray(props.childrenSlate)) return props.childrenSlate;
        if (typeof props.children === 'string') {
            return [{
            type: 'paragraph',
            children: [{ text: props.children }],
            }];
        }
        return fallbackValue;
    });

    const extractPlainText =(nodes: Descendant[]): string => {
        return nodes.map(node => {
            if ('text' in node) return node.text;
            if ('children' in node) return extractPlainText(node.children);
            return '';
        }).join('\n');
    }
    const debouncedUpdate = useDebounced((val: Descendant[]) => {
        console.log('SAVE', val)
        const text = extractPlainText(val);
        const props = componentRef.current;
        
        
        if (props) {
            updateComponentProps({
                component: { props: props },
                data: {
                    children: text,
                    childrenSlate: val
                },
            });
        }
    }, 600, [props]);
    const renderLeaf = useCallback(({ attributes, children, leaf }) => {
        const style: React.CSSProperties = {};
        if (leaf.color) style.color = leaf.color;
        if (leaf.bgcolor) style.backgroundColor = leaf.bgcolor;

        if (leaf.bold) children = <strong>{children}</strong>;
        if (leaf.italic) children = <em>{children}</em>;
        if (leaf.underline) children = <u>{children}</u>;
        if (leaf.link?.href) {
            children = <a style={style} href={leaf.link.href} target="_blank" rel="noopener noreferrer">{children}</a>;
        }
        if (leaf.fontFamily) style.fontFamily = leaf.fontFamily;
        if (leaf.textAlign) {
            style.display = 'block';
            style.textAlign = leaf.textAlign;
        }

        return <span {...attributes} style={style}>{children}</span>;
    }, []);
    const renderElement = useCallback(({ attributes, children, element }) => {
        switch (element.type) {
            case 'heading-one':
                return <h4 {...attributes}>{children}</h4>;
            case 'bulleted-list':
                return <ul {...attributes}>{children}</ul>;
            case 'numbered-list':
                return <ol {...attributes}>{children}</ol>;
            case 'list-item':
                return <li {...attributes}>{children}</li>;
            case 'blockquote':
                return <blockquote {...attributes}>{children}</blockquote>;
            default:
                return <p {...attributes}>{children}</p>;
        }
    }, []);
    //React.useEffect(() => {componentRef.current = props; }, [props]);
    React.useEffect(() => {
        setValue(props.childrenSlate);
    }, [dataId]);
    

    return(
        <div 
            data-id={dataId} 
            data-type="Text" 
            style={{ width: '100%' }}
        >
            { globalThis.EDITOR ? (
                <Slate 
                    editor={editor} 
                    //value={value}
                    initialValue={value} 
                    onValueChange={(val) => {
                        setValue(val);
                        debouncedUpdate(val);
                    }}
                >
                    { selected.content.get({noproxy:true})?.props?.['data-id'] === dataId && (
                        <Toolbar />
                    )}
                    <Editable
                        readOnly={!globalThis.EDITOR}
                        renderLeaf={renderLeaf}
                        renderElement={renderElement}
                        placeholder="Введите текст..."
                        onPointerEnter={() => context.dragEnabled.set(false)}
                        onPointerLeave={() => context.dragEnabled.set(true)}
                        spellCheck
                        autoFocus
                        onFocus={() => {
                            setIsEditing(true);
                            context.dragEnabled.set(false); // отключаем drag при редактировании
                        }}
                        onBlur={() => {
                            setIsEditing(false);
                            context.dragEnabled.set(true); // возвращаем drag после редактирования
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                const { selection } = editor;
                                if (!selection || !Range.isCollapsed(selection)) return;

                                const [match] = Editor.nodes(editor, {
                                    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item',
                                });

                                if (match) {
                                    event.preventDefault();
                                    const [node] = match;

                                    const isEmpty = Editor.isEmpty(editor, node);

                                    if (isEmpty) {
                                        // ВЫХОД ИЗ СПИСКА
                                        Transforms.setNodes(editor, { type: 'paragraph' });

                                        Transforms.unwrapNodes(editor, {
                                            match: n =>
                                                !Editor.isEditor(n) &&
                                                SlateElement.isElement(n) &&
                                                ['bulleted-list', 'numbered-list'].includes(n.type),
                                            split: true,
                                        });
                                    } else {
                                        // НОВЫЙ <li>
                                        Transforms.insertNodes(editor, {
                                            type: 'list-item',
                                            children: [{ text: '' }],
                                        });
                                    }
                                }
                            }
                        }}
                        style={{
                            outline: 'none',
                            padding: '4px 8px',
                            borderRadius: 4,
                            transition: 'box-shadow 0.2s ease',
                            boxShadow: isEditing ? '0 0 0 1px #1976d2' : 'none',
                            backgroundColor: 'transparent',
                            minHeight: 30,
                        }}
                    />
                </Slate>
            ) : (
                <>
                    { props.childrenSlate
                        ? renderSlateContent(props.childrenSlate)
                        : <p>{props.children}</p>
                    }
                </>
        )   }
        </div>
    );
});


export const TypographyWrapper = React.forwardRef((props: any, ref) => {
    const { children, ['data-id']: dataId, styles, style, fullWidth, ...otherProps } = props;
    const [text, setText] = React.useState(children);
    const infoState = useInfoState();
    const selected = useHookstate(infoState.select.content);
    
    const handleBlur = (e) => {
        const newText = e.target.innerText;
        setText(newText);
        updateComponentProps({
            component: { props: props },
            data: { children: newText }
        });
    }

    
    return(
        <Typography 
            ref={ref} 
            data-id={dataId}
            data-type="Typography" 
            contentEditable={globalThis.EDITOR && selected.get({noproxy:true})?.props?.['data-id'] === dataId}
            suppressContentEditableWarning
            onBlur={handleBlur}
            {...otherProps}
            sx={{ width: '100%', display:'block', ...styles?.text }}
        >
            { text ?? children }
        </Typography>
    );
});