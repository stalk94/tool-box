import { Button, IconButton, Typography } from "@mui/material"
import { propsButton, propsIconButton, propsTypography } from './props';


export const listAllComponents = {
    Button: Button,
    Typography: Typography,
    IconButton: IconButton
}

export const listConfig = {
    Button: {
        props: propsButton,
    },
    Typography: {
        props: propsTypography
    },
    IconButton: {
        props: propsIconButton
    }
}
