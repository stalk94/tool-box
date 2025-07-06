import React from 'react';
import { Badge, ButtonProps, IconButtonProps } from '@mui/material';
import { iconsList } from '../../components/tools/icons';
import { Settings } from '@mui/icons-material';
import { exportedMuiButton, exportedMuiIconButton } from './export/Buttons';

type IconButtonWrapperProps = IconButtonProps & {
    'data-id': number
    'data-type': 'IconButton'
    'data-group'?: string 
    responsive: boolean
    fullWidth: boolean
    icon: string
    style: React.CSSProperties
}
type ButtonWrapperProps = ButtonProps & {
    'data-id': number
    'data-type': 'Button'
    'data-group'?: string 
    responsive: boolean
    isArea?: boolean
    fullWidth: boolean
    style: React.CSSProperties
    startIcon: string
    endIcon: string
    children: string
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    variant: 'outline' | 'dash' | 'soft' | 'ghost' | 'link'
}



export const ButtonWrapper = React.forwardRef((props: ButtonWrapperProps, ref) => {
    const { startIcon, variant, size, color, endIcon, children, fullWidth, responsive, style, 'data-id': dataId, 'data-group': dataGroup, isArea, ...otherProps } = props;
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
    const getSize = React.useMemo(()=> {
        if (responsive) return 'btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl';
        else return `btn-${size}`;
    }, [size, responsive]);
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
        <div
            ref={ref}
            data-id={dataId}
            data-type="Button"
            style={{ 
                width: fullWidth ? "100%" : "fit-content"
            }}
        >
            <button 
                className={`
                    btn 
                    whitespace-nowrap
                    btn-${variant}
                    btn-${color} 
                    ${getSize}
                    ${fullWidth && 'w-full'}
                `}
                style={style}
                onClick={()=> {
                    sharedEmmiter.emit('event', {
                        id: dataId,
                        dataGroup,
                        type: 'onClick'
                    });
                }}
            >
                { StartIcon && <StartIcon /> }
                { children }
                { EndIcon && <EndIcon /> }
            </button>
        </div>
    );
});
export const IconButtonWrapper = React.forwardRef((props: IconButtonWrapperProps, ref) => {
    const { 'data-id': dataId, size, responsive, 'data-group': dataGroup, icon, children, fullWidth, style, ...otherProps } = props;
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
    const getSize = React.useMemo(()=> {
        if (responsive) return 'btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl';
        else return `btn-${size}`;
    }, [size, responsive]);
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
        <div
            ref={ref}
            data-id={dataId}
            data-type="IconButton"
            style={{ 
                width: fullWidth ? "100%" : "fit-content"
            }}
        >
            <button 
                className={`
                    btn 
                    btn-ghost
                    btn-${getSize}
                    btn-circle
                `}
                style={style}
                onClick={()=> {
                    sharedEmmiter.emit('event', {
                        id: dataId,
                        dataGroup,
                        type: 'onClick'
                    });
                }}
            >
                <Icon />
            </button>
        </div>
    );
});