import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LabelLogin, LabelPassword, LabelColor, LabelSelect, LabelToogler, LabelDateOrTime } from '../../components/input/labels.inputs';
import { CheckBoxInput, SwitchInput } from '../../components/input/input.any';
import Slider from '../../components/input/slider';
import AppBar from '../../components/app-bar/Preview';
import { Person, Key, VerifiedUser, Home, Settings, CloudCircle, Menu, Logout } from '@mui/icons-material';
import Editor from '../../app/editor';
import CardPreview from '../../components/carts/Preview';
import MenuBase from '../../components/popup/base';
import SideBarAndToolPanel from '../../components/nav-bars/tool-left';
import { Button } from '@mui/material';



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
            options: ['input', 'switch', 'chekbox', 'slider', 'appBar', 'card', 'menu', 'toolNavBar'],
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

const Templates =(args)=> {
    const [name, setName] = React.useState();
    const [test, setTest] = React.useState([]);
    const [dops, setDops] = React.useState([]);

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

    const useDops =()=> {
        if(args.name === 'appBar') return ['navigation'];
        
        return;
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
        ])

        setName(args.name);
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