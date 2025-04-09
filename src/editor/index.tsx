import React from 'react';
import FormSettings from './base';
import { BaseType, FlexType, TextType } from './type';
import { Box, IconButton } from '@mui/material';
import { Close, ExpandMore, ExpandLess } from '@mui/icons-material';
import { objectToCss, parseCss } from './hooks';

// вкладка редактора стилей
export default function({ component }: { component: EventTarget }) {
    const cache = React.useRef({});
    const [style, setStyle] = React.useState<CSSStyleDeclaration>();
    const [open, setOpen] = React.useState(false);
    const [type, setType] = React.useState<'text'>();

    
    const readFileStyle = () => {
        fetch('/api/fs?file=app/dynamic.css')
            .then((response) => response.json())
            .then((data) => {
                if (data.content) {
                    const parse = parseCss(data.content);
                    cache.current = parse;
                }
            })
            .catch((error) => {
                console.error('Ошибка при чтении файла');
            });
    }
    const writeFile = async() => {
        const res = await fetch('/api/fs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                filepath: 'app/dynamic.css', 
                content: objectToCss(cache.current)
            }),
        });
    }
    const handlerResetDefault =()=> {
        const el = component as HTMLElement;
        if (!el) return;

        cache.current[el.id] = {};
        writeFile();
    }
    const handlerChange =(state: Record<string, string>)=> {
        const el = component as HTMLElement;
        if (!el) return;

        Object.entries(state).forEach(([key, value]) => {
            if(value !== undefined && el.id) {
                if(!cache.current[el.id]) cache.current[el.id] = {};
                cache.current[el.id][key] = value;
            }
            el.style.setProperty(key, value);
        });
        writeFile();
    }
    React.useEffect(() => {
        const el = component as HTMLElement;

        if(el) {
            readFileStyle();
            setType(el.dataset.edit);
            const styles = window.getComputedStyle(el);
            setStyle(styles);
            setOpen(true);
        }
    }, [component]);


    return(
        <div
            style={{
                position: 'fixed',
                display: 'flex',
                flexDirection: 'column',
                height: open ? '100%' : '44px',
                width: open ? '25vw' : 'auto',
                top: 0,
                right: 0,
                background: 'rgb(61, 61, 61)',
                zIndex: 999,
                overflowY: 'auto'
            }}
        >
            <Box
                sx={{

                }}
            >
                <IconButton 
                    onClick={()=> setOpen(!open)}
                >
                    { open 
                        ? <ExpandLess/>
                        : <ExpandMore />
                    }
                </IconButton>
            </Box>
            { (type && style) &&
                <FormSettings
                    open={open}
                    type={type}
                    style={style}
                    onChange={handlerChange}
                />
            }
        </div>
    );
}