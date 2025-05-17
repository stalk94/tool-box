import React from 'react'
import { Form, FormAuthOrReg, FormAuthOrRegProps, FormProps } from '../../index';


export type TypesSchemaFormAuth= 'login' | 'password' | 'email' | 'phone' | 'confirm';
type WrapperFormAuthOrRegProps = FormAuthOrRegProps & {
    'data-id': number
    style: React.CSSProperties
    pathApi: string
}
type WrapperFormUniversalProps = FormProps & {
    'data-id': number
    style: React.CSSProperties
}



export const WrapperFormAuthOrReg = React.forwardRef((props: WrapperFormAuthOrRegProps, ref) => {
    const [loading, setLoading] = React.useState(false);
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const {
        'data-id': dataId,
        style,
        pathApi,
        enbleLogin,
        enblePassword,
        enbleEmail,
        enablePhone,
        enableConfirm,
        ...otherProps
    } = props;

    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='DataTable'
            style={{ ...style, width: '100%' }}
        >
            <FormAuthOrReg
                loading={}
            />
        </div>
    );
});

export const WrapperFormUniversal = React.forwardRef((props: WrapperFormUniversalProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const {
        'data-id': dataId,
        style,
        
        ...otherProps
    } = props;

    

    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='DataTable'
            style={{ ...style, width: '100%' }}
        >
             
        </div>
    );
});