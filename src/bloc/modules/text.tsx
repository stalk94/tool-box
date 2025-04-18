import React, { useMemo, useCallback } from 'react';
import { Typography } from '@mui/material';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, Range } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { useHookstate } from '@hookstate/core';
import { updateComponentProps } from '../utils/updateComponentProps';
import context, { infoState } from '../context'
import { Popover, IconButton, Stack, Tooltip, Box } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Title, FormatListBulleted, FormatListNumbered, 
    FormatQuote, FormatColorText, FormatColorFill, FiberSmartRecord
} from '@mui/icons-material';
import { RgbaColorPicker } from 'react-colorful';


const LIST_TYPES = ['numbered-list', 'bulleted-list'];
const fallbackValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];


const Toolbar = () => {
    const editor = useSlate();
    const [anchorText, setAnchorText] = React.useState<HTMLElement | null>(null);
    const [anchorBg, setAnchorBg] = React.useState<HTMLElement | null>(null);
    const [anchorMarker, setAnchorMarker] = React.useState<HTMLElement | null>(null);


    const toggleMark = (format: string) => {
        const isActive = isMarkActive(editor, format);
        if (isActive) {
            Editor.removeMark(editor, format);
        } else {
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
        Editor.addMark(editor, 'color', rgba);
    }
    const handleBgChange = (color: { r: number, g: number, b: number, a: number }) => {
        const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        Editor.addMark(editor, 'bgcolor', rgba);
    }


    return (
        <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 0.5, 
                border: '1px solid #d0d0d02d',
                py: 1,
                borderRadius: 1,
                background: '#0d0c0c40'
            }}
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
                    <IconButton size="small" onClick={() => toggleMark('underline')}>
                        <FormatUnderlined sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Цвет текста">
                    <IconButton size="small" onClick={(e) => setAnchorText(e.currentTarget)}>
                        <FormatColorText sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Фон текста">
                    <IconButton size="small" onClick={(e) => setAnchorBg(e.currentTarget)}>
                        <FormatColorFill sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* Вторая строка: структура и блоки */}
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
                <Tooltip title="Заголовок H1">
                    <IconButton size="small" onClick={() => toggleBlock('heading-one')}>
                        <Title sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
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
                {/* сюда можно добавить H2, H3, выравнивание, undo/redo */}
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


export const TextWrapper = React.forwardRef((props: any, ref) => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [isEditing, setIsEditing] = React.useState(false);
    const { children, ['data-id']: dataId, ...otherProps } = props;
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
    const onChange = (val: Descendant[]) => {
        setValue(val);
        const text = extractPlainText(val); // для простого children

        const component = selected.content.get({ noproxy: true });
        if (component) {
            updateComponentProps({
                component,
                data: {
                    children: text,
                    childrenSlate: val // 👈 сохраняем полностью
                },
            });
        }
    }
    const renderLeaf = useCallback(({ attributes, children, leaf }) => {
        const style: React.CSSProperties = {};
        if (leaf.color) style.color = leaf.color;
        if (leaf.bgcolor) style.backgroundColor = leaf.bgcolor;

        if (leaf.bold) children = <strong>{children}</strong>;
        if (leaf.italic) children = <em>{children}</em>;
        if (leaf.underline) children = <u>{children}</u>;

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


    return(
        <div 
            data-id={dataId} 
            data-type="Text" 
            style={{ width: '100%' }}
        >
            <Slate 
                editor={editor} 
                initialValue={value} 
                onChange={onChange}
            >
                {selected.content.get({noproxy:true})?.props?.['data-id'] === dataId && (
                    <Toolbar />
                )}
                <Editable
                    renderLeaf={renderLeaf}
                    renderElement={renderElement}
                    placeholder="Введите текст..."
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
        </div>
    );
});


export const TypographyWrapper = React.forwardRef((props: any, ref) => {
    const { children, ['data-id']: dataId, ...otherProps } = props;

    
    return(
        <Typography 
            ref={ref} 
            data-type="Typography" 
            {...otherProps}
        >
            { children }
        </Typography>
    );
});