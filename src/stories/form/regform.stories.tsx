import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RegForm from '../../components/form/auth-reg';
import OauthForm from '../../components/form/oauth';
import { Divider, Typography } from '@mui/material';



const meta: Meta<typeof RegForm> = {
    title: 'Form',
    component: RegForm,
    argTypes: {
        
    },
}
export default meta;


const Templates =(args)=> {
    const sx =  {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: '100%', 
        opacity: 0.85,
        mb: 1.5,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }


    return(
        <div style={{margin: '30%', marginTop:'10%'}}>
            <OauthForm
                loading={false}
                onClick={console.log}
                scheme={[
                    { type: 'google', button: { sx, color: 'primary' } },
                    { type: 'facebook', button: { sx, color: 'primary' } }
                ]}
            />

            <Divider sx={{mt: 2}}>
                <Typography variant="body1" color="text.secondary">
                    or
                </Typography>
            </Divider>

            <RegForm
                onRegistration={(state)=> console.log('click registaration', state)}
                loading={args.loading}
                scheme={[
                    { placeholder: 'min 6 simbol', type: 'login', sx:{mt:2}, value:'lox' },
                    { type: 'email', sx:{mt:2} },
                    { placeholder: 'min 6 simbol', type: 'password', sx:{mt:2} },
                    { placeholder: 'min 6 simbol', type: 'password2', sx:{mt:2} }
                ]}
                button={{
                    children: 'registration',
                    variant: 'outlined',
                    color: 'success',
                    size: 'large',
                    sx: {
                        width: '100%',
                        mt: 5,
                        boxShadow: 1,
                        
                    }
                }}
            />
        </div>
    );
}


type Story = StoryObj<typeof RegForm>;
export const RegistrationForm: Story = {
    args: {
       loading: true
    },
    render: (props)=> <Templates {...props} />
}