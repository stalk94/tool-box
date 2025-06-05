import React from 'react';
import { ComponentSerrialize, Component, ComponentProps } from '../type';
import { FormAuthOrReg, Form } from '../../index';
import { exportTipTapValue, toJSXProps, toObjectLiteral, renderComponentSsr } from './export/utils';
import { updateComponentProps } from '../helpers/updateComponentProps';

type FormAuthOrRegWrapperProps = ComponentProps & {
    pathClickButton?: string
}



export const FormAuthOrRegWrapper = React.forwardRef((props: FormAuthOrRegWrapperProps, ref) => {
    const { 
        'data-id': dataId, 
        style, 
        items, 
        apiPath, 
        fullWidth, 
        pathClickButton, 
        ...otherProps 
    } = props;


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
    const exportCode = (call) => {
        const schemeOauth = [
            { type: 'google', button: { sx, color: 'primary' } },
            { type: 'facebook', button: { sx, color: 'primary' } }
        ];

        const code = (`
            import { FormAuthOrReg } from '@lib/index';

            export default function AuthForm() {
                return(
                    <FormAuthOrReg
                        onClickRegistration={(data)=> {
                            sharedEmmiter.emit('event', {
                                id: ${dataId},
                                data: data,
                                type: 'clickRegistration'
                            });
                        })}
                        onClickOauthButton={(type)=> {
                            sharedEmmiter.emit('event', {
                                id: ${dataId},
                                data: { type: type },
                                type: 'clickOauth'
                            });
                        })}
                        schemeAuthForm={${toObjectLiteral(testSchemeBaseInput)}}
                        schemeOauth={${toObjectLiteral(schemeOauth)}}
                    />
                );
            }
        `);

        call(code);
    }
    React.useEffect(() => {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.' + dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.' + dataId, handler);
        }
    }, [props]);


    return (
        <div
            ref={ref}
            data-id={dataId}
            data-type='FormAuth'
            style={{ ...style, width: '100%', display: 'block' }}
        >
            <FormAuthOrReg
                onClickRegistration={(data) => {
                    sharedEmmiter.emit('event', {
                        id: dataId,
                        data: data,
                        type: 'clickRegistration'
                    });
                }}
                onClickOauthButton={(type) => {
                    sharedEmmiter.emit('event', {
                        id: dataId,
                        data: { type: type },
                        type: 'clickOauth'
                    });
                }}
                schemeAuthForm={testSchemeBaseInput}
                schemeOauth={[
                    { type: 'google', button: { sx, color: 'primary' } },
                    { type: 'facebook', button: { sx, color: 'primary' } }
                ]}
            />
        </div>
    );
});

