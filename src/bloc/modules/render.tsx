import { propsButton, propsIconButton, propsTypography, propsImage } from '../config/props';
import { ButtonWrapper, IconButtonWrapper } from './buttons';
import { ImageWrapper } from './media';
import { TypographyWrapper } from './text';


// список всех компонентов редактора
export const listAllComponents = {
    Button: ButtonWrapper,
    Typography: TypographyWrapper,
    IconButton: IconButtonWrapper,
    Image: ImageWrapper
}

// базовые inject параметры 
export const listConfig = {
    Button: {
        props: propsButton,
    },
    Typography: {
        props: propsTypography,
    },
    IconButton: {
        props: propsIconButton,
    },
    Image: {
        props: propsImage,
    }
}