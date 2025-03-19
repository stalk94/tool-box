import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { Google, Facebook, ExitToApp } from '@mui/icons-material';


export type TypeOauth = 'google' | 'facebook';
export type SchemaOauth = {
    type: TypeOauth
    button?: ButtonProps
}
type PropsOauthForm = {
    scheme: SchemaOauth[]
    loading?: boolean 
    handlerClickOauth: (type: TypeOauth)=> void
}



/**
 *  Виртуальная форма кнопок входа через соц сети  
 *  - `handlerClickOauth` - должен вызывать обработчик авторизации из глобала
 */
export default function({ scheme, loading, handlerClickOauth }: PropsOauthForm) {
    const geticon =(type: TypeOauth)=> {
        if(type === 'google') return <Google />;
        else if(type === 'facebook') return <Facebook />;
    }


    return(
        <React.Fragment>
            { scheme.map((elem, index)=> 
                <Button
                    onClick={()=> handlerClickOauth(elem.type)}
                    key={index}
                    disabled={loading}
                    variant='outlined'
                    color='secondary'
                    startIcon={
                        loading 
                            ? <CircularProgress size={24} color="inherit" /> 
                            : geticon(elem.type)
                    }
                    children={`Continue with ${elem.type}`}
                    endIcon={<ExitToApp />}
                    { ...elem.button }
                />
            )}
        </React.Fragment>
    );
}