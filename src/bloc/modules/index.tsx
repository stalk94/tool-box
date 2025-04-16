import { registerComponent } from './utils/registry';
import { ButtonWrapper, IconButtonWrapper } from './buttons';
import { TypographyWrapper } from './text';
import { ImageWrapper } from './media';
import { Settings } from '@mui/icons-material';



registerComponent({
    type: 'Button',
    component: ButtonWrapper,
    defaultProps: {
        children: 'Button',
        variant: 'outlined',
        color: 'primary',
        fullWidth: true,
        style: {display: 'block'}
    },
    icon: Settings,
    category: 'interactive',
});

registerComponent({
    type: 'Typography',
    component: TypographyWrapper,
    defaultProps: {
        children: 'Заголовок',
        variant: 'h5',
        fullWidth: true,
        style: {
            display: 'flex',  
        }
    },
    icon: Settings,
    category: 'interactive',
});

registerComponent({
    type: 'Image',
    component: ImageWrapper,
    defaultProps: {
        src: 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg',
        alt: 'Картинка',
        width: '50%',
        height: 'auto',
    },
    icon: Settings,
    category: 'media',
});

registerComponent({
    type: 'IconButton',
    component: IconButtonWrapper,
    defaultProps: {
        icon: 'Add',
        color: 'default',
    },
    icon: Settings,
    category: 'interactive',
});


console.log('✅ component registry')