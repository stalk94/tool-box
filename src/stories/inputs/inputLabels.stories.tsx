import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LabelLogin, LabelPassword, LabelColor, LabelEmail, LabelPhone, LabelSelect } from '../../components/input/labels.inputs';
import { Person, Key, Tag, AlternateEmail } from '@mui/icons-material';
import { Button } from '@mui/material';



const meta: Meta<typeof LabelLogin> = {
    title: 'Inputs',
    component: '',
    argTypes: {
        position: {
            control: "select",
            options: [undefined, "column", "left", "right"],
        }
    },
}
export default meta;

const Templates =(args)=> {
    // валидатор login
    const validateLogin =(value: string)=> {
        let helper;
        let result = true;

        if (value.length > 5) {
            if (value.length > 32) helper = 'Логин более 32 символов';
        }
        else helper = 'Логин менее 6 символов';
        if(value.length > 1 && !/^[a-zA-Z0-9_-]+$/.test(value)) {
            helper = 'Присутствуют запрешенные символы.';
        }


        if(helper) {
            result = false;
        }

        return {
            result,
            helperText: helper
        }
    }
    // валидатор пароля
    const validatePass =(value: string)=> {
        let helper;
        let result = true;

        if (value.length > 5) {
            if (value.length > 32) helper = 'Пароль более 32 символов';
        }
        else helper = 'Пароль менее 6 символов';

        if(helper) {
            result = false;
        }

        return {
            result,
            helperText: helper
        }
    }
    // Проверка валидности номера телефона
    const validatePhone = (phone: string) => {
        let helperText;
        const phoneRegex = /^\+?[1-9]\d{6,14}$/;
        const result = phoneRegex.test(phone);
        if(!result) helperText = 'Неверный формат номера';

        return {
            result,
            helperText
        }
    }
    // Проверка валидности email
    const validateEmail = (email: string) => {
        let helperText;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const result = emailRegex.test(email);
        if(!result) helperText = 'Неверный формат email';

        return {
            result,
            helperText
        }
        
    }
    

    return(
        <div style={{margin:'30%', marginTop:'10%'}}>
            <LabelLogin
                onChange={console.log}
                useVerify={validateLogin}
                {...args}
                left={<Person />}
                label={'Login:'}
            />
             <LabelSelect
                onChange={console.log}
                {...args}
                items={[{id:'1', label:'test'},{id:'2', label:'test2'},{id:'3', label:'test3'}]}
                placeholder='Выбрать'
            />
            <LabelPassword
                onChange={console.log}
                useVerify={validatePass}
                {...args}
                left={<Key />}
                label={'Password:'}
            />
            <LabelEmail
                useVerify={validateEmail}
                onChange={console.log}
                {...args}
                label={'E-mail:'}
            />
            <LabelPhone
                useVerify={validatePhone}
                onChange={console.log}
                {...args}
            />
        </div>
    );
}


type Story = StoryObj<typeof LabelLogin>;
export const All: Story = {
    args: {
        disabled: false,
        position: 'column',
        placeholder: 'min 10 simbol',
        label: 'Test:'
    },
    render: (props)=> <Templates {...props} />
}