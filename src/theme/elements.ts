import { ThemeOptions } from '@mui/material/styles'

/*
    глобальные стили для элементов
*/



/** Установки для типографии */
export const typography: ThemeOptions = {
    typography: {
        fontFamily: '"Inter", "Arial", sans-serif',
        fontWeightRegular: 400,
        allVariants: {
            wordBreak: 'break-word',        // перенос с разрывом
            letterSpacing: '0.5px',
        },
        h4: {
            fontSize: '2rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        body1: {
            
        },
        body2: {
            
        },
        subtitle1: {
            opacity: 0.7
        },
        subtitle2: {
            opacity: 0.5
        },
        caption: {
            opacity: 0.5
        },
        button: {
            textTransform: 'uppercase',
            fontWeight: 600,
        },
    },
}

/** предустановки компонентов */
export const components: ThemeOptions = {
    components: {
        
    }
}