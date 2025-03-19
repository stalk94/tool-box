import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SelectButton from '../components/popup/select.button';
import {colors, variants} from '../components/button';
import { Home, Settings, Info } from "@mui/icons-material";



const meta: Meta<typeof SelectButton> = {
    title: 'Buttons',
    component: SelectButton,
    argTypes: {
        variant: {
            control: "select",
            options: variants,
        },
        color: {
            control: "select",
            options: colors,
        }
    },
}
export default meta;

const Templates =(args)=> {
    const navLinksTest = [
        {
            id: "1",
            icon: <Home />,
            label: "Category 1",
            children: [
                { id: "1:1", label: "Subcat 1.1" },
                { id: "1:2", label: "Subcat 1.2" }
            ]
        },
        {
            id: "2",
            label: "Category 2",
            children: [
                { id: "2:1", label: "Subcat 2.1" }
            ]
        },
        { id: "3", label: "Category 3" }
    ];
    const [value, setvalue] = React.useState({ id: "3", label: "Subcategory 1.2" });
    const [items, setItems] = React.useState(navLinksTest);

    const handlerOnSelect =(item)=> {
        console.log(item);
        
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
        setvalue(item);
    }


    return(
        <div style={{margin:'5%'}}>
            {colors.map((color, index)=> 
                 <SelectButton key={index}
                    {...args}
                    sx={{ml: 1, mb: 2}}
                    onChange={handlerOnSelect}
                    items={items}
                    defaultLabel='Выбрать'
                    value={value}
                    color={color}
                >
                 
                </SelectButton>
            )}
        </div>
    );
}


type Story = StoryObj<typeof SelectButton>;
export const SelectsButton: Story = {
    args: {
       variant: 'outlined'
    },
    render: (props)=> <Templates {...props} />
}