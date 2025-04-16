import { iconsList } from '../../components/tools/icons';
import { ViewModule, TouchApp, Photo, Layers, Widgets } from '@mui/icons-material';

// ! мусор
/** 
export const componentRegistry = {
    Typography: {
        type: 'Typography',
        category: 'interactive',
        icon: iconsList.TextFields,
        defaultProps: {
            children: 'Текст по умолчанию',
            variant: 'body1',
            color: 'textPrimary',
            'data-type': 'Typography',
            fullWidth: true,
            style: {
                display: 'flex',  
            }
        },
    },
    Button: {
        type: 'Button',
        category: 'interactive',
        icon: iconsList.TouchApp,
        defaultProps: {
            children: 'Кнопка',
            variant: 'outlined',
            color: 'primary',
            'data-type': 'Button',
            fullWidth: true,
            style: {display: 'block'}
        },
    },
    IconButton: {
        type: 'IconButton',
        category: 'interactive',
        icon: iconsList.Settings,
        defaultProps: {
            icon: 'Settings',
            color: 'secondary',
            'data-type': 'IconButton',
        },
    },
    Image: {
        type: 'Image',
        category: 'media',
        icon: iconsList.Photo,
        defaultProps: {
            src: 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg',
            alt: 'Картинка',
            width: '50%',
            height: 'auto',
            'data-type': 'Image',
        },
    },
    Video: {
        type: 'Video',
        category: 'media',
        icon: iconsList.VideoLibrary,
        defaultProps: {
            src: '',
            controls: true,
            'data-type': 'Video',
        },
    },
    Card: {
        type: 'Card',
        category: 'block',
        icon: iconsList.ViewModule,
        defaultProps: {
            elevation: 2,
            sx: { padding: 2 },
            'data-type': 'Card',
        },
    },
    Carousel: {
        type: 'Carousel',
        category: 'complex',
        icon: iconsList.Slideshow,
        defaultProps: {
            items: [],
            'data-type': 'Carousel',
        },
    },
}
*/


// * final
export const componentGroups = {
    block: {
        label: 'Базовые блоки',
        icon: ViewModule,
    },
    interactive: {
        label: 'Интерактивные',
        icon: TouchApp,
    },
    media: {
        label: 'Медиа',
        icon: Photo,
    },
    complex: {
        label: 'Сложные блоки',
        icon: Layers,
    },
    misc: {
        label: 'Прочее',
        icon: Widgets,
    },
}