import React from 'react';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge, { badgeClasses, BadgeProps } from '@mui/material/Badge';
import { Delete, Done, Favorite, Send, Settings, Close, Add } from '@mui/icons-material';
import Button, { ButtonProps } from '@mui/material/Button';


type BadgeIconProps = {
    value: React.ReactNode
} & BadgeProps


export const colors = ["secondary", "inherit", "primary", "success", "error", "info", "warning"];
export const variants = ["text" , "contained" , "outlined"];
const icons = {
    delete: <Delete/>, 
    done: <Done />, 
    favorite: <Favorite/>, 
    send: <Send/>, 
    settings: <Settings/>, 
    close: <Close/>, 
    add: <Add/>
}


function BadgeIcon({ value, color, ...props }: BadgeIconProps) {
    const CartBadge = styled(Badge)`
        & .${badgeClasses.badge} {
            top: -8px;
            right: 0px;
        }
    `;

    return(
        <CartBadge 
            badgeContent={value} 
            color={color} 
            overlap="circular" 
            {...props}
        />
    );
}



export default {
    Badge: BadgeIcon
}