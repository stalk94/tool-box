import React from 'react';
import { ComponentSerrialize, Component, ComponentProps } from '../type';
import { FormAuthOrReg, Form } from '../../index';
import { useComponentSizeWithSiblings } from './helpers/hooks';
import { updateComponentProps } from '../helpers/updateComponentProps';

type FormAuthOrRegWrapperProps = ComponentProps & {

}



export const FormAuthOrRegWrapper = React.forwardRef((props: FormAuthOrRegWrapperProps, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => { });
    const { 'data-id': dataId, style, items, apiPath, fullWidth, ...otherProps } = props;
    const { width, height, container } = useComponentSizeWithSiblings(dataId);

    const handleChange = (index: number, data: string) => {
        const copy = [...items];

        if (copy[index]) {
            copy[index] = data;

            updateComponentProps({
                component: { props },
                data: { items: [...copy] }
            });
        }
    }
    

    degidratationRef.current = (call) => {
        const code = (`
            
        `);

        call(code);
    }
    React.useEffect(() => {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, []);
    const sx = {
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
    const testSchemeBaseInput = [
        { placeholder: 'min 6 simbol', type: 'login', sx: { mt: 2 } },
        { type: 'email', sx: { mt: 2 } },
        { placeholder: 'min 6 simbol', type: 'password', sx: { mt: 2 } },
        { placeholder: 'min 6 simbol', type: 'password2', sx: { mt: 2 } }
    ];
    const schemeOauthTest = [
        { type: 'google', button: { sx, color: 'primary' } },
        { type: 'facebook', button: { sx, color: 'primary' } }
    ];


    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='FormAuth'
            style={{ ...style, width: '100%', display: 'block' }}
        >
            <FormAuthOrReg
                //onClickRegistration={console.log}
                //onClickOauthButton={console.log}
                schemeAuthForm={testSchemeBaseInput}
                schemeOauth={schemeOauthTest}
            />
        </div>
    );
});

