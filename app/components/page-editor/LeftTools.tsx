import React from "react";
import { Button, IconButton, Box, MenuItem, Typography, Divider, Select, Popover } from "@mui/material";
import {
    Note, AccountTree, Logout, Palette, Extension, Save, Functions,
    FolderSpecial, Edit, Add, RadioButtonUnchecked, RadioButtonChecked
} from "@mui/icons-material";
import { useEditor } from './context';
import LeftSideBarAndTool from '@components/nav-bars/tool-left'
import { usePopUpName } from '@bloc/utils/usePopUp';
import { getUniqueBlockName } from "@bloc/utils/editor";;
import { BREAKPOINT_WIDTH } from './WorkArea';




const RenderListProject = ({ currentCat }) => {
    const { list, curentPageName, setPageName } = useEditor();
    const { popover, handleOpen } = usePopUpName((name) => {
        const uniqueName = getUniqueBlockName(name.trim(), list);

        fetch(`/api/pages/${uniqueName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                meta: {
                    name: uniqueName,
                    title: uniqueName
                },
                variants: {
                    lg: {
                        layout: [],
                        width: 1200
                    },
                    md: {
                        layout: [],
                        width: 960
                    },
                    sm: {
                        layout: [],
                        width: 600
                    },
                    xs: {
                        layout: [],
                        width: 480
                    }
                }
            }
            )
        })
            .then(res => res.json())
            .then((v) => {
                setPageName(uniqueName);
                console.log(v);
            })
            .catch(console.error);
    });


    return (
        <>
            {currentCat === 'all' &&
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button
                        size="small"
                        sx={{ mx: 2, mb: 2, mt: 1 }}
                        variant="outlined"
                        color="success"
                        onClick={handleOpen}
                    >
                        <Add /> add page
                    </Button>
                    { list.map((pageName, index) =>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                my: 0.7,
                                cursor: 'pointer',
                                borderBottom: `1px dotted ${curentPageName === pageName ? '#ffffff61' : '#83818163'}`,
                                opacity: curentPageName === pageName ? 1 : 0.6,
                                '&:hover': {
                                    backgroundColor: '#e0e0e022',
                                }
                            }}
                            onClick={() => setPageName(pageName)}
                            key={index}
                        >
                            <Typography
                                variant='inherit'
                                style={{ fontSize: '15px', color: 'white' }}
                            >
                                <Note sx={{fontSize: 14, mr: 1}} />
                                { pageName }
                            </Typography>
                            <button
                                style={{
                                    cursor: 'pointer',
                                    color: curentPageName === pageName ? '#C9C9C9' : '#c9c5c5c7',
                                    background: 'transparent',
                                    marginLeft: 'auto',
                                    borderRadius: '4px',
                                    border: 'none',
                                }}
                            >
                                {curentPageName === pageName
                                    ? <RadioButtonChecked sx={{ fontSize: '16px' }} />
                                    : <RadioButtonUnchecked sx={{ fontSize: '16px' }} />
                                }
                            </button>
                        </Box>
                    )}
                </Box>
            }
            { popover }
        </>
    );
}
const RenderProjectTopPanel = () => {
    const { list, curentPageName, setPageName } = useEditor();


    return(
        <Box sx={{ display: 'flex' }}>
            <Select
                size="small"
                defaultValue={'📜'}
                onChange={(e) => console.log(e.target.value)}
                displayEmpty
                sx={{ fontSize: 14, height: 36, color: '#ccc', background: '#2a2a2a84', ml: 1, mt: 0.3 }}
            >
                {['📜', '⭐'].map((scope) => (
                    <MenuItem key={scope} value={scope} >
                        { scope }
                    </MenuItem>
                ))}
            </Select>
            <IconButton
                color="inherit"
                sx={{}}
                //onClick={handleOpen}
            >
                <Add />
            </IconButton>
        </Box>
    );
}
const RenderBlockScopeTopPanel = () => {
    const { curentScope, setCurentScope } = useEditor();
    const [list, setList] = React.useState<string[]>([]);


    const geAlltScopes = () => {
        fetch(`api/list-scopes`)
            .then((res)=> res.json())
            .then((data)=> {
                setList(data);
                if(data[0]) setCurentScope(data[data.length-1]);
            })
            .catch(console.error);
    }
    React.useEffect(()=> {
        geAlltScopes();
    }, []);


    return(
        <Box sx={{ display: 'flex' }}>
            <Select
                size="small"
                //defaultValue={curentScope}
                value={curentScope ?? 'any'}
                onChange={(e) => setCurentScope(e.target.value)}
                displayEmpty
                sx={{ fontSize: 14, height: 36, color: '#ccc', background: '#2a2a2a84', ml: 1, mt: 0.3 }}
            >
                { list.map((scope) => (
                    <MenuItem key={scope} value={scope} >
                        { scope }
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
}
// todo: доработать preview
const RenderBlockScope = () => {
    const [link, setLink] = React.useState<string>('snapshots/test-blok-top.png');
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const { curentScope, curentScopeBlockData, setSelectBlockData } = useEditor();


    const handleOpen = (event: React.MouseEvent<HTMLElement>, meta) => {
        setLink(meta.preview);
        setAnchorEl(event.currentTarget);
    }
    const getKeyNameBreakpoint = (width?: number) => {;
        const sorted = Object.entries(BREAKPOINT_WIDTH).sort((a, b) => a[1] - b[1]);

        for (const [key, value] of sorted) {
            if (width <= value) return key;
        }

        // Если ничего не нашли — возвращаем самый крупный
        return sorted[sorted.length - 1][0];
    }
    const getColor = (key: string) => {
        return {
            lg: '#d75d41',   // индиго — для десктопа, стабильный и строгий
            md: '#edb156',   // teal — для планшета, свежий и универсальный
            sm: '#83c9d4',   // тёплый оранжевый — для малых экранов, но без агрессии
            xs: '#909090'
        }[key] ?? '#495057';
    }
     

    return(
        <Box sx={{ display: 'flex', flexDirection:'column' }}>
            { curentScopeBlockData?.map((block, index)=> 
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        my: 0.7,
                        cursor: 'pointer',
                        borderBottom: `1px dotted #ffffff61`,
                        '&:hover': {
                            backgroundColor: '#e0e0e022',
                        }
                    }}
                    onClick={()=> setSelectBlockData(block.data)}
                    key={index}
                >
                    <Typography
                        variant='inherit'
                        style={{ fontSize: '15px', color: 'white' }}
                    >
                        <span style={{ color: getColor(getKeyNameBreakpoint(block.data?.size?.width)), marginRight: '5px' }}>
                            [{ getKeyNameBreakpoint(block.data?.size?.width) }]
                        </span>

                        <span style={{ marginLeft: '5px', color: 'white' }}>
                            { block.name }
                        </span>
                    </Typography>
                    <button
                        style={{
                            cursor: 'pointer',
                            color: '#C9C9C9',
                            background: 'transparent',
                            marginLeft: 'auto',
                            borderRadius: '4px',
                            border: 'none',
                        }}
                    >
                    </button>
                </Box>
            )}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={()=> setAnchorEl(null)}
                disableRestoreFocus
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{ width: 300 }}>
                    <img
                        src={link}
                    />
                </Box>
            </Popover>
        </Box>
    );
}
const useProject = (currentCat:  "catalog" | "blocs") => {
    if(currentCat === "catalog") return {
        start: (<RenderProjectTopPanel />),
        children: (<RenderListProject currentCat={'all'}/>)
    }
    else if(currentCat === "blocs") return {
        start: (<RenderBlockScopeTopPanel />),
        children: (<RenderBlockScope />)
    }
}



// левая панель редактора
export default function ({ addPage, useDump }) {
    const { list, currentToolPanel, setCurrentToolPanel } = useEditor();
    
    const menuItems = [
        { id: 'catalog', label: 'Каталог', icon: <AccountTree /> },
        { divider: <Divider sx={{borderColor: 'rgba(128, 128, 129, 0.266)',my:1.2}}/> },
        { id: 'blocs', label: 'Блоки', icon: <Extension /> },
        { divider: true },
    ];
    const endItems = [
        { id: 'save', label: 'Сохранить', icon: <Save /> },
        { id: 'exit', label: 'Выход', icon: <Logout /> }
    ];
    const { start, children } = useProject(currentToolPanel) ?? { start: null, children: null };

    

    return (
        <LeftSideBarAndTool
            selected={currentToolPanel}
            sx={{ height: '100%' }}
            schemaNavBar={{ items: menuItems, end: endItems }}
            width={260}
            onChangeNavigation={(item)=> {
                if(item.id !== 'save') setCurrentToolPanel(item.id);
                else useDump();
            }}
            start={start}
        >
            <Box sx={{ mt: 1, mx: 1 }}>
                { children }
            </Box>
        </LeftSideBarAndTool>
    );
}