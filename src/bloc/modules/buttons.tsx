import React from 'react';
import { Badge, Button, IconButton, ButtonProps, IconButtonProps } from '@mui/material';
import { iconsList } from '../../components/tools/icons';
import { Settings } from '@mui/icons-material';
import { exportedMuiButton, exportedMuiIconButton } from './export/Buttons';

type IconButtonWrapperProps = IconButtonProps & {
    'data-id': number
    'data-type': 'IconButton'
    'data-group'?: string 
    fullWidth: boolean
    icon: string
    style: React.CSSProperties
}
type ButtonWrapperProps = ButtonProps & {
    'data-id': number
    'data-type': 'Button'
    'data-group'?: string 
    isArea?: boolean
    fullWidth: boolean
    style: React.CSSProperties
    startIcon: string
    endIcon: string
    children: string
}



export const IconButtonWrapper = React.forwardRef((props: IconButtonWrapperProps, ref) => {
    const { 'data-id': dataId, 'data-group': dataGroup, icon, children, fullWidth, style, ...otherProps } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : Settings;

    const exportCode = (call) => {
        const code = exportedMuiIconButton(
            dataId,
            icon ? <Icon/> : null,
            style,
            otherProps
        );
        
        call(code);
    }
    React.useEffect(()=> {
        if(!EDITOR) return;
        
        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.'+dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.'+dataId, handler);
        }
    }, [props]);

    
    return (
        <IconButton
            ref={ref}
            data-type="IconButton"
            aria-label={`button-${icon}`}
            style={style}
            onClick={()=> {
                sharedEmmiter.emit('event', {
                    id: dataId,
                    type: 'onClick'
                });
            }}
            { ...otherProps }
        >
            <Icon />
        </IconButton>
    );
});
export const ButtonWrapper = React.forwardRef((props: ButtonWrapperProps, ref) => {
    const { startIcon, endIcon, children, style, 'data-id': dataId, 'data-group': dataGroup, isArea, ...otherProps } = props;
    const StartIcon = startIcon && iconsList[startIcon] ? iconsList[startIcon] : null;
    const EndIcon = endIcon && iconsList[endIcon] ? iconsList[endIcon] : null;
    
    
    const exportCode = (call) => {
        const code = exportedMuiButton(
            dataId,
            StartIcon ? <StartIcon/> : null,
            EndIcon ? <EndIcon/> : null,
            style,
            children,
            otherProps
        );
        
        call(code);
    }
    React.useEffect(()=> {
        if(!EDITOR) return;

        const handler = (data) => exportCode(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.'+dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.'+dataId, handler);
        }
    }, [props]);
    

    return (
        <Button
            data-type="Button"
            variant="outlined"
            startIcon={StartIcon ? <StartIcon /> : undefined}
            endIcon={EndIcon ? <EndIcon /> : undefined}
            sx={{ whiteSpace: 'nowrap' }}
            style={style}
            onClick={()=> {
                sharedEmmiter.emit('event', {
                    id: dataId,
                    type: 'onClick'
                });
            }}
            { ...otherProps }
        >
            { children }
        </Button>
    );
});