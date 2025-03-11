import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Button, { ButtonProps } from '@mui/material/Button';
import { Delete } from '@mui/icons-material';
import Select from './components/select';
import { Typography } from '@mui/material';


interface StyledButtonProps extends ButtonProps {
    danger?: boolean
}


const CustomButton = styled(Button, {
    shouldForwardProp: (prop)=> prop !== 'danger'
})<StyledButtonProps>(({ danger, theme })=> {
    console.log(theme.palette)

    return ({
        backgroundColor: danger ? theme.palette.error.main : theme.palette.primary.main,
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        '&:hover': {
            backgroundColor: danger ? theme.palette.error.dark : theme.palette.primary.dark,
        },
    })
});



export default function() {
    const [val, setVal] = React.useState('');
    

    return (
        <React.Fragment>
            <Button variant="outlined" color="secondary">
                succes
            </Button>
            <IconButton aria-label="delete" color='error'>
                <Delete />
            </IconButton>
            <Select
                label="test"
                value={val}
                onChange={setVal}
                items={[{value:0,label:<Delete />},{value:1,label:55}]}
            />
            <Typography variant="button" color="error" align="right">
                Этот текст выровнен по правому краю и красного цвета (ошибка).
            </Typography>
        </React.Fragment>
    );
}