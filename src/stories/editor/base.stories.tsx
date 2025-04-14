import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LabelLogin, LabelPassword, LabelColor, LabelSelect, LabelToogler, LabelDateOrTime } from '../../components/input/labels.inputs';
import { CheckBoxInput, SwitchInput } from '../../components/input/input.any';
import Slider from '../../components/input/slider';
import AppBar from '../../components/app-bar/Preview';
import { Person, Key, VerifiedUser, Home, Settings, CloudCircle, Menu, Logout } from '@mui/icons-material';
import Editor from '../../app/StyleEditor';
import CardPreview from '../../components/carts/Preview';
import MenuBase from '../../components/popup/base';
import SideBarAndToolPanel from '../../components/nav-bars/tool-left';
import { Button } from '@mui/material';
import DataTable from '../../components/data-table';
import { Column } from 'primereact/column';
import Flag from '../../components/tools/flag';
import { Avatar } from 'primereact/avatar';
import { Rating } from 'primereact/rating';

//! глобальное хранилище наблюдаемых пропов 
globalThis._props_ = new Map<HTMLElement, any>();


const meta: Meta<typeof LabelLogin> = {
    title: 'Editor',
    component: LabelLogin,
    argTypes: {
        position: {
            control: "select",
            options: [undefined, "column", "left", "right"],
        },
        name: {
            control: "select",
            options: ['input', 'switch', 'chekbox', 'slider', 'appBar', 'card', 'menu', 'toolNavBar', 'table'],
        }
    },
}
export default meta;


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
                        <Avatar image={data.image}/>
                    }
                />
                <Column header="Name" filter filterPlaceholder="По именам" sortable field='name' />
                <Column header="Rating" sortable field='rating' 
                    body={(data)=> 
                        <Rating cancel={false} value={data.rating} />
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


const Templates =(args)=> {
    const [name, setName] = React.useState();
    const [test, setTest] = React.useState([]);

    const inputs = [
        <LabelLogin
            onChange={console.log}
            {...args}
            left={<Person />}
            label={'Login:'}
        />,
        <LabelSelect
            onChange={console.log}
            {...args}
            items={[{ id: '1', label: 'test' }, { id: '2', label: 'test2' }, { id: '3', label: 'test3' }]}
            placeholder='Выбрать'
        />,
        <LabelPassword
            onChange={console.log}
            {...args}
            left={<Key />}
            label={'Password:'}
        />,
        <LabelColor
            onChange={console.log}
            toolVisible
            {...args}
        />,
        <LabelDateOrTime
            isTimePicker={true}
            onChange={console.log}
            {...args}
        />,
        <LabelToogler
            onChange={console.log}
            items={[
                { id: 1, label: 'one' },
                { id: 2, label: 'two' }
            ]}
            {...args}
            label={'Toogle:'}
            sx={{
                height: '42px'
            }}
        />,
    ];
    const switchs = [
        <SwitchInput
            {...args}
            onChange={console.log}
            label={'on/off'}
        />
    ];
    const chekBox = [
        <CheckBoxInput
            {...args}
            onChange={console.log}
            label={'check'}
        />
    ];
    const slider = [
        <Slider
            onChange={console.log}
            sx={{
                p: 20
            }}
        />
    ];
    const appBar = [
        <AppBar />,
        <div style={{textAlign:'center'}}>
            CONTENT
        </div>
    ];
    const card = [
        <CardPreview 
            text='This impressive paella is a perfect party dish and a fun meal to coo together with your guests. Add 1 cup of frozen peas along with the mussels,if you like.'
        />
    ];
    const table = [<Tabletest />]

    
    const useDops =()=> {
        if(args.name === 'appBar') return ['navigation'];
        
        return;
    }
    const handleGlobalClick = (e) => {
        console.log('Клик по странице', e.target);
    }


    React.useEffect(()=> {
        if(args.name === 'input') setTest(inputs);
        else if(args.name === 'switch') setTest(switchs);
        else if(args.name === 'chekbox') setTest(chekBox);
        else if(args.name === 'slider') setTest(slider);
        else if(args.name === 'appBar') setTest(appBar);
        else if(args.name === 'card') setTest(card);
        else if(args.name === 'menu') setTest([<MenuTest />]);
        else if(args.name === 'toolNavBar') setTest([
            <SideBarAndToolPanel
                sx={{ height: '100%' }}
                width='30%'
                schemaNavBar={{
                    items: [
                        {
                            id: "1", label: "Меню", icon: <Menu />, children: [
                                { id: "1:1", label: "Вложенный 1" },
                                { id: "1:2", label: "Вложенный 2", icon: <Settings /> },
                            ]
                        },
                        { divider: true },
                        { id: "3", label: "Главная", icon: <Home /> },
                        { id: "4", label: "Главная", icon: <CloudCircle />,
                            state: { badge: 1 }
                        },
                        { id: "5", label: "Выход", icon: <VerifiedUser /> },
                    ],
                    end: [
                        { id: "7", label: "Выход", icon: <Settings /> },
                        { id: "8", label: "Выход", icon: <Logout /> }
                    ]
                }}
                start={
                    <div>start</div>
                }
                end={
                    <div>end</div>
                }
                onChangeNavigation={console.log}
            >
                <div style={{display:'flex'}}>
                    <div>content</div>
                </div>
            </SideBarAndToolPanel>
        ]);
        else if(args.name === 'table') setTest(table);

        setName(args.name);
        window.addEventListener('click', handleGlobalClick);

        return () => {
            window.removeEventListener('click', handleGlobalClick);
        };
    }, [args]);


    return(
        <div style={{height:'100%', width:'100%', overflowY:'auto'}}>
            <Editor 
                name={name}
                test={test}
                dops={useDops()}
            />
        </div>
    );
}


type Story = StoryObj<typeof LabelLogin>;
export const BaseColor: Story = {
    args: {
        name: 'input',
        disabled: false,
        success: false,
        error: false,
        position: 'column',
        placeholder: 'min 10 simbol',
        label: 'Test:'
    },
    render: (props)=> <Templates {...props} />
}