import React from "react";
import { taskadeTheme, lightTheme, darkTheme } from 'src/theme';
import { ThemeProvider, CssBaseline, Palette, Theme, Button, Avatar, Rating, useTheme, Divider, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { settingsSlice } from "../context";
import { writeFile } from 'src/app/plugins';
import { Flag, TextInput, NumberInput, ColorInput, DateInput, ToggleInput, SelectInput, 
    SliderInput, CheckBoxInput, Accordion, SwitchInput
} from 'src/index';
import { colorsList, colorsButtons } from '../config/theme';
import AppBar from 'src/components/app-bar/Preview';
import CardPreview from 'src/components/carts/Preview';
import MenuBase from 'src/components/popup/base';
import DataTable from 'src/components/data-table';
import { Column } from 'primereact/column';
import { Home, Settings } from "@mui/icons-material";


const listTheme = {
    taskade: taskadeTheme,
    light: lightTheme,
    dark: darkTheme
}

const Text =()=> {
    return(
        <div style={{ margin: '30px' }}>
            <Typography
                variant='h2'
            >
                h2 - Заголовок
            </Typography>
            <Typography
                variant='h4'
            >
                h4 - Заголовок
            </Typography>
            <Typography
                variant='body1'
            >
                body1 (primery)
            </Typography>
            <Typography
                variant='subtitle1'
            >
                subtitle1
            </Typography>
            <Typography
                variant='body2'
            >
                body2 (secondary)
            </Typography>
            <Typography
                variant='subtitle2'
            >
                subtitle2
            </Typography>
            <Typography
                variant='caption'
            >
                caption (мелкие пояснения) *inline
            </Typography>
        </div>
    );
}
const MenuTest =({ })=> {
    const navLinksTest = [
        { id:'1', label: "Главная", icon: <Home />, comand: (v) => console.log(v) },
        { id:'2', label: "Услуги", icon: <Settings />,
            children: [
                { id:'2:1', label: "Услуга 1", comand: (v) => console.log(v) },
                { id:'2:2', label: "Услуга 2", comand: (v) => console.log(v) },
                { id:'2:3', label: "Услуга 3", comand: (v) => console.log(v) },
            ]
        },
        { divider: true },
        { id: '3', label: "Услуги-2",
            children: [
                { id: '3:1', label: "Услуга 1", icon: <Home />, comand: (v) => console.log(v) },
                { id: '3:2', label: "Услуга 2", comand: (v) => console.log(v) },
                { id: '3:3', label: "Услуга 3", comand: (v) => console.log(v) },
            ]
        },
    ];
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [items, setItems] = React.useState(navLinksTest);

    
    const handlerOnSelect =(item)=> {
        const newElems = navLinksTest.map((elem)=> {
            if(elem.id === item.id) elem.select = true;
                
            if(elem.children) {
                elem.children = elem.children.map((elem)=> {
                    if(elem.id === item.id) elem.select = true;
                    return elem;
                });
            }

            return elem;
        });

        setItems(newElems);
    }
    React.useEffect(()=> {
        buttonRef.current.click();
    }, []);
 

    return(
        <div style={{margin:'20% 40%'}}>
            <MenuBase test={true} items={items} onSelect={handlerOnSelect} >
                <Button ref={buttonRef} variant='outlined' id='TestButton'>
                    open
                </Button>
            </MenuBase>
        </div>
    );
}
const Tabletest =()=> {
    const testData = [
        {name: "Amy Elsner", country: 'RU', rating: 4, data:'03-11-2025', image: 'https://imgv3.fotor.com/images/slider-image/A-clear-close-up-photo-of-a-woman.jpg'},
        {name: "John Doe", country: 'US', rating: 5, data:'12-05-2024', image: 'https://randomuser.me/api/portraits/men/1.jpg'},
        {name: "Emma Smith", country: 'UK', rating: 3, data:'07-19-2023', image: 'https://randomuser.me/api/portraits/women/2.jpg'},
        {name: "Carlos Rodríguez", country: 'ES', rating: 4, data:'11-22-2022', image: 'https://randomuser.me/api/portraits/men/3.jpg'},
        {name: "Sofia Müller", country: 'DE', rating: 2, data:'05-14-2021', image: 'https://randomuser.me/api/portraits/women/4.jpg'},
        {name: "Luca Moretti", country: 'IT', rating: 5, data:'09-30-2020', image: 'https://randomuser.me/api/portraits/men/5.jpg'},
        {name: "Isabelle Dubois", country: 'FR', rating: 3, data:'04-10-2019', image: 'https://randomuser.me/api/portraits/women/6.jpg'},
        {name: "Hiroshi Tanaka", country: 'JP', rating: 4, data:'08-27-2025', image: 'https://randomuser.me/api/portraits/men/7.jpg'},
        {name: "Chen Wei", country: 'CN', rating: 5, data:'06-13-2024', image: 'https://randomuser.me/api/portraits/men/8.jpg'},
        {name: "Olga Ivanova", country: 'RU', rating: 2, data:'03-03-2023', image: 'https://randomuser.me/api/portraits/women/9.jpg'},
        {name: "Pedro Gomez", country: 'MX', rating: 3, data:'01-29-2022', image: 'https://randomuser.me/api/portraits/men/10.jpg'},
        {name: "Fatima Al-Farsi", country: 'AE', rating: 4, data:'11-05-2021', image: 'https://randomuser.me/api/portraits/women/11.jpg'},
        {name: "William Johnson", country: 'CA', rating: 5, data:'07-21-2020', image: 'https://randomuser.me/api/portraits/men/12.jpg'},
        {name: "Elena Petrova", country: 'RU', rating: 3, data:'02-14-2019', image: 'https://randomuser.me/api/portraits/women/13.jpg'},
        {name: "Mohammed Hassan", country: 'EG', rating: 2, data:'12-09-2025', image: 'https://randomuser.me/api/portraits/men/14.jpg'},
        {name: "Aisha Khan", country: 'PK', rating: 4, data:'05-18-2024', image: 'https://randomuser.me/api/portraits/women/15.jpg'},
        {name: "Benjamin Andersson", country: 'SE', rating: 5, data:'08-26-2023', image: 'https://randomuser.me/api/portraits/men/16.jpg'},
        {name: "Laura García", country: 'AR', rating: 3, data:'10-31-2022', image: 'https://randomuser.me/api/portraits/women/17.jpg'},
        {name: "Nathan Brown", country: 'AU', rating: 4, data:'06-20-2021', image: 'https://randomuser.me/api/portraits/men/18.jpg'},
        {name: "Mia Nilsson", country: 'NO', rating: 2, data:'03-25-2020', image: 'https://randomuser.me/api/portraits/women/19.jpg'}
    ];
    return(
        <div style={{ width: '100%', height: '80vh',padding:'5%'}}>
            <DataTable
                virtualScrollerOptions={{ itemSize: 55 }}
                value={testData}
                header={
                    <div>
                        header
                    </div>
                }
                footer={
                    <div>
                        footer
                    </div>
                }
            >
                <Column header="Image" field='image' 
                    body={(data)=> 
                        <Avatar src={data.image}/>
                    }
                />
                <Column header="Name" filter filterPlaceholder="По именам" sortable field='name' />
                <Column header="Rating" sortable field='rating' 
                    body={(data)=> 
                        <Rating value={data.rating} />
                    }
                />
                <Column header="Data" sortable field='data' />
                <Column header="Country" sortable field='country' 
                    body={(data)=> 
                        <Flag code={data.country} />
                    }
                />
            </DataTable>
        </div>
    );
}
const inputs = (
    <div style={{marginLeft: '15vw', marginRight: '15vw', marginTop:'5vh'}}>
    <TextInput
        value='test'
        position='column'
        label='Text:'
        onChange={console.log}
    />
    <NumberInput
        position='column'
        label='Number:'
        onChange={console.log}
    />
    <ColorInput
        position='column'
        label='Color:'
        onChange={console.log}
    />
    <DateInput
        position='column'
        label='Date:'
        onChange={console.log}
    />
    <ToggleInput
        position='column'
        onChange={console.log}
        items={[
            { id: 1, label: 'one' },
            { id: 2, label: 'two' }
        ]}
        label={'Toogle:'}
        sx={{
            height: '42px'
        }}
    />
    <SelectInput
        position='column'
        onChange={console.log}
        label={'Select:'}
        items={[
            { id: '1', label: 'one' },
            { id: '2', label: 'two' }
        ]}
    />
    </div>
);
const Colors =()=> {
    const theme = useTheme();
    const [variant, setVariant] = React.useState<"text" | "contained" | "outlined">('contained');
    const getGrey =()=> {
        Object.entries(theme.palette.grey).map((key, value)=> 
            <div>
                
            </div>
        );
    }

    return(
        <div>
            <div style={{marginBottom: '50px', paddingRight: '40%'}}>
                <ToggleInput
                    value={variant}
                    onChange={(v)=> setVariant(v)}
                    items={[
                        { id:'text', label:'text' },
                        { id:'outlined', label:'outlined' },
                        { id:'contained', label:'contained' },
                    ]}
                />
            </div>
            {colorsButtons.map((color, index) =>
                <Button style={{ margin: '5px' }} key={index} variant={variant} color={color}>
                    { color }
                </Button>
            )}
            <div style={{marginLeft:'5vw', marginRight: '40vw', marginTop: '5vh'}}>
                <TextInput
                    value='test'
                    position='column'
                    label='Text:'
                    onChange={console.log}
                />
            </div>
        </div>
    );
}
const listTest = {
    background: <></>,
    input: inputs,
    table: <Tabletest />,
    accordion: (
        <div style={{marginLeft: '15vw', marginRight: '15vw', marginTop:'5vh'}}>
            <Accordion
                items={[
                    {
                        header: 'header-1',
                        content: <div>content</div>
                    },
                    {
                        header: 'header-2',
                        content: <div>content</div>
                    }
                ]}
                activeIndexs={[0]}
            />
        </div>
    ),
    colors: <Colors />,
    action: inputs,
    menu: <MenuTest />,
    text: <Text />,
    chekbox: (
        <CheckBoxInput
            onChange={console.log}
            label={'check'}
        />
    ),
    switch: (
        <SwitchInput
            onChange={console.log}
            label={'on/off'}
        />
    ),
    slider: (
        <SliderInput
            onChange={console.log}
            value={20}
        />
    ),
    appBar: (
        <div style={{marginTop: '5vh'}}>
            <AppBar />
            <div style={{textAlign:'center', marginTop: '1vh'}}>
                CONTENT
            </div>
        </div>
    ),
    card: (
        <div style={{marginLeft: '15vw', marginRight: '15vw', marginTop:'5vh'}}>
            <CardPreview 
                text='This impressive paella is a perfect party dish and a fun meal to coo together with your guests. Add 1 cup of frozen peas along with the mussels,if you like.'
            />
        </div>
    ),
    divider: (
        <div style={{marginLeft: '15vw', marginRight: '15vw', marginTop:'5vh'}}>
            <Divider
                flexItem
                variant="fullWidth"
                children='test'
            />
            <div style={{height: '5vh',marginRight: '35vw'}}>
                <Divider
                    
                    variant="fullWidth"
                    orientation="vertical"
                />
            </div>
        </div>
    ),
}


export default function PreviewThemeSettings() {
    const [themeData, setThemeData] = React.useState<Theme>({}); 
    const currentTheme = settingsSlice.theme.currentTheme.use();
    const currentGroop = settingsSlice.theme.currentGroop.use();
    
    const getNewPallete =(pallete: Palette)=> {
        const result: Palette = {};
        const exclude = ['mode', 'contrastThreshold', 'getContrastText', 'augmentColor', 'tonalOffset'];
        
        Object.entries(pallete).forEach(([key, value])=> {
            if(!exclude.includes(key)) result[key] = value;
        });

        return result;
    }
    const useSaveFile =()=> {
        setThemeData((themeData)=> {
            writeFile('src/theme', 'color.json', JSON.stringify(getNewPallete(themeData.palette), null, 4));
            return themeData;
        }); 
    }
    const handleThemeEdit =(data: Palette)=> {
        setThemeData((old)=> {
            old.palette = data;
            return { ...old };
        });
    }
    React.useEffect(()=> {
        setThemeData(listTheme[currentTheme]);
    }, [currentTheme]);
    React.useEffect(()=> {
        if(themeData.palette) settingsSlice.theme.pallete.set(getNewPallete(themeData.palette));
    }, [themeData]);
    React.useEffect(()=> {
        EVENT.on('themeEdit', handleThemeEdit);
        EVENT.on('saveColor', useSaveFile);

        return ()=> {
            EVENT.off('themeEdit', handleThemeEdit);
            EVENT.off('saveColor', useSaveFile);
        }
    }, []);
    

    return (
        <ThemeProvider theme={themeData}>
            <Container
                sx={{
                    height: '99%',
                    overflowY: 'hidden'
                }}
            >
                <div
                    style={{
                        margin: 1,
                        maxWidth: '100%',
                        height: '99%',
                        border: '1px dashed #fbfbfa26',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                > 
                    { listTest[currentGroop] }
                </div>
            </Container>
        </ThemeProvider>
    );
}