import React from "react";
import { Button, useTheme, Box, Popover, Typography, Divider } from "@mui/material";
import {
    Settings, AccountTree, Logout, Palette, Extension, Save, Functions,
    FolderSpecial, Edit, Add
} from "@mui/icons-material";
import { useEditor } from './context';
import { TooglerInput } from '@components/input/input.any';
import LeftSideBarAndTool from '@components/nav-bars/tool-left'
import { TextInput } from "src/index";
import { getUniqueBlockName } from "@bloc/utils/editor";



const RenderListProject = ({ currentCat }) => {
    const { list, curentPageName, setPageName } = useEditor();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [newPageName, setNewPageName] = React.useState('');
    
    
    const handleCreateNewPage = () => {
      
    }
    const renderPopUp =()=> (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
                <TextInput
                    size="small"
                    placeholder="Имя блока"
                    value={newPageName}
                    onChange={setNewPageName}
                />
                <Button
                    variant="contained"
                    size="small"
                    disabled={!newPageName.trim()}
                    onClick={handleCreateNewPage}
                >
                    OK
                </Button>
            </Box>
        </Popover>
    );
    

    return (
        <>
            { currentCat === 'all' &&
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Button 
                        size="small" 
                        sx={{mx:2, mb:2, mt:1}} 
                        variant="outlined" 
                        color="success"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                        <Add /> add page
                    </Button>
                    { list.map((pageName, index) =>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                my: 0.7,
                                borderBottom: '1px dotted #83818163',
                                opacity: curentPageName === pageName ? 1 : 0.6,
                            }}
                            key={index}
                        >
                            <Typography variant='subtitle1' style={{fontSize:'14px'}}>
                                { pageName }
                            </Typography>
                            <button
                                style={{
                                    cursor: 'pointer',
                                    color: curentPageName === pageName ? '#C9C9C9' : '#c9c5c5c7',
                                    background: 'transparent',
                                    marginLeft: 'auto',
                                    borderRadius: '4px',
                                    border: curentPageName === pageName ? `1px solid #C9C9C9` : 'none',
                                }}
                                onClick={() => setPageName(pageName)}
                            >
                                <Edit />
                            </button>
                        </Box>
                    )}
                    { renderPopUp() }
                </Box>
            }
        </>
    );
}
const useProject = (currentCat, setCurrentCat) => {
    const categories = [
        { id: 'all', icon: FolderSpecial }
    ];
    
    return {
        start: (
            <TooglerInput
                value={currentCat}
                onChange={setCurrentCat}
                sx={{ px: 0.2 }}
                items={categories.map((cat) => {
                    const Icon = cat.icon ?? Settings;
                    return {
                        id: cat.id,
                        label: <Icon sx={{ fontSize: 18 }} />
                    };
                })}
            />
        ),
        children: (<RenderListProject currentCat={'all'}/>)
    };
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

   
    const changeNavigation = (item) => {
        setCurrentToolPanel(item.id);
    }
    const changeEditor = (newDataProps) => {
        
    }

    const panelRenderers = {
        catalog: () => useProject(list, setCurrentToolPanel),
    }
    const { start, children } = panelRenderers[currentToolPanel]
        ? panelRenderers[currentToolPanel]()
        : { start: null, children: null };


    return (
        <LeftSideBarAndTool
            selected={currentToolPanel}
            sx={{ height: '100%' }}
            schemaNavBar={{ items: menuItems, end: endItems }}
            width={260}
            onChangeNavigation={changeNavigation}
            start={start}
        >
            <Box sx={{ mt: 1, mx: 1 }}>
                { children }
            </Box>
        </LeftSideBarAndTool>
    );
}