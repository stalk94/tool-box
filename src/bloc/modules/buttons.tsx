 import React from 'react';
import { Badge, Button, IconButton } from '@mui/material';
import { iconsList } from '../../components/tools/icons';
import { Settings } from '@mui/icons-material';
import { exportedMuiButton, exportedMuiIconButton } from './export/Buttons';



export const IconButtonWrapper = React.forwardRef((props: any, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { 'data-id': dataId, icon, children, fullWidth, style, ...otherProps } = props;
    const Icon = icon && iconsList[icon] ? iconsList[icon] : Settings;

    degidratationRef.current = (call) => {
        const code = exportedMuiIconButton(
            dataId,
            icon ? <Icon/> : null,
            style,
            otherProps
        );
        
        call(code);
    }
    React.useEffect(()=> {
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.'+dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.'+dataId, handler);
        }
    }, []);

    
    return (
        <IconButton
            ref={ref}
            data-type="IconButton"
            style={style}
            { ...otherProps }
        >
            <Icon />
        </IconButton>
    );
});
export const ButtonWrapper = React.forwardRef((props: any, ref) => {
    const degidratationRef = React.useRef<(call) => void>(() => {});
    const { startIcon, endIcon, children, style, 'data-subs': subs, 'data-id': dataId, ...otherProps } = props;
    const StartIcon = startIcon && iconsList[startIcon] ? iconsList[startIcon] : null;
    const EndIcon = endIcon && iconsList[endIcon] ? iconsList[endIcon] : null;
    
    
    degidratationRef.current = (call) => {
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
        const handler = (data) => degidratationRef.current(data.call);
        sharedEmmiter.on('degidratation', handler);
        sharedEmmiter.on('degidratation.'+dataId, handler);

        return () => {
            sharedEmmiter.off('degidratation', handler);
            sharedEmmiter.off('degidratation.'+dataId, handler);
        }
    }, []);
    

    return (
        <Button
            ref={ref}
            data-type="Button"
            variant="outlined"
            startIcon={StartIcon ? <StartIcon /> : undefined}
            endIcon={EndIcon ? <EndIcon /> : undefined}
            style={style}
            { ...otherProps }
        >
            { children }
        </Button>
    );
});

