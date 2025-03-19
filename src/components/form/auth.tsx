import React from 'react';
import { ButtonProps } from '@mui/material';
import RegistrationForm, { BaseFormProps, Schema } from './registration';


type AutorisationProps = {
    scheme: Schema[]
    loading: boolean
    onAutorisation: (outScheme: Record<string, string|number>)=> void  
    button?: ButtonProps
}


export default function({ scheme, loading, onAutorisation, button }: AutorisationProps) {
    return(
        <RegistrationForm
            scheme={scheme}
            loading={loading}
            onRegistration={onAutorisation}
            button={button}
        />
    );
}