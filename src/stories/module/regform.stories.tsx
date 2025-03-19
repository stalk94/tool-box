import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RegForm from '../../components/form/registration';
import OauthForm from '../../components/form/oauth';
import { Divider, Typography } from '@mui/material';



const meta: Meta<typeof RegForm> = {
    title: 'Module',
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
        opacity: 0.7,
        mb: 1.5
    }


    return(
        <div style={{margin: '30%', marginTop:'10%'}}>
            <OauthForm
                loading={false}
                handlerClickOauth={console.log}
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
                loading={false}
                scheme={[
                    { placeholder: 'min 6 simbol', type: 'login' },
                    { type: 'email' },
                    { placeholder: 'min 6 simbol', type: 'password' }
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
       
    },
    render: (props)=> <Templates {...props} />
}