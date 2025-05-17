import React from 'react';
import { registerComponent } from './utils/registry';
import { ButtonWrapper, IconButtonWrapper, SliderWrapper } from './buttons';
import { TypographyWrapper, TextWrapper } from './text';
import { ImageWrapper } from './media';
import { 
    Settings, Description, FlashAuto, ViewList, Check, EditAttributes,
    RadioButtonChecked, LinearScale, EventAvailable, Schedule, Exposure, TextFields, Create, Image,
    ViewCarousel, BackupTable, ListAlt, Repartition, ViewQuilt,
    VideoCameraFront,
    Height
 } from '@mui/icons-material';
import { TextInputWrapper, NumberInputWrapper, DateInputWrapper, SliderInputWrapper,
    ToggleInputWrapper, SwitchInputWrapper, CheckBoxInputWrapper, SelectInputWrapper,
    AutoCompleteInputWrapper, FileInputWrapper, 
} from './inputs';
import { HorizontalCarouselWrapper, PromoBannerWrapper, VideoWrapper, CardWrapper } from './media';
import { DividerWrapper, AvatarWrapper, ChipWrapper} from './any';
import { TabsWrapper, BottomNavWrapper, AccordionWrapper, DataTableWrapper, HeaderWrapper, BreadcrumbsWrapper } from './complex';
import { sharedContext, sharedEmmiter } from './utils/shared';
import { Box } from '@mui/material';
import { serializeJSX } from '../utils/sanitize';
import { InputStyles } from '../type';
import { MediaCarouselCustom, MediaCarouselVertical } from './sources/media-carousel';




/**
 * Приоритет: 
 * * пропс настройки компонентов 
 * * панель проектов 
 * * доработать редактор сетки
 * * 
 */
//////////////////////////////////////////////////////////////////////
globalThis.sharedContext = sharedContext;
globalThis.sharedEmmiter = sharedEmmiter;
globalThis.degidratationBuffer = {};
///////////////////////////////////////////////////////////////////////


registerComponent({
    type: 'Button',
    component: ButtonWrapper,
    defaultProps: {
        children: 'Button',
        variant: 'outlined',
        color: 'primary',
        fullWidth: true,
        startIcon: 'none',
        endIcon: 'none',
        style: {}
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
    icon: TextFields,
    category: 'interactive',
});
registerComponent({
    type: 'Text',
    component: TextWrapper,
    defaultProps: {
        fullWidth: true,
    },
    icon: TextFields,
    category: 'interactive',
});

registerComponent({
    type: 'Image',
    component: ImageWrapper,
    defaultProps: {
        fullWidth: true,
        src: '/placeholder.jpg',
        file: '',
        'data-source': 'src',
        alt: 'Картинка',
    },
    icon: Image,
    category: 'media',
});
registerComponent({
    type: 'Video',
    component: VideoWrapper,
    defaultProps: {
        src: '',
        file: '',
        'data-source': 'src',
        autoplay: false,
        controls: true,
        loop: false,
        poster: '',
        fullWidth: true,
    },
    icon: VideoCameraFront,
    category: 'media',
});

registerComponent({
    type: 'IconButton',
    component: IconButtonWrapper,
    defaultProps: {
        fullWidth: true,
        icon: 'Add',
        color: 'default',
    },
    icon: Settings,
    category: 'interactive',
});

// инпуты
registerComponent({
    type: 'TextInput',
    component: TextInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        placeholder: 'ввод',
        divider: 'none',
        fullWidth: true,
        leftIcon: 'none',
        styles: {} satisfies InputStyles,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Create,
    category: 'interactive',
});
registerComponent({
    type: 'Number',
    component: NumberInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        placeholder: 'ввод number',
        fullWidth: true,
        styles: {} satisfies InputStyles,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Exposure,
    category: 'interactive',
});
registerComponent({
    type: 'Time',
    component: DateInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        type: 'time',
        fullWidth: true,
        styles: {} satisfies InputStyles,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Schedule,
    category: 'interactive',
});
registerComponent({
    type: 'Date',
    component: DateInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        type: 'date',
        fullWidth: true,
        styles: {} satisfies InputStyles,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: EventAvailable,
    category: 'interactive',
});
registerComponent({
    type: 'Slider',
    component: SliderInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        leftIcon: 'none',
        rightIcon: 'none',
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: LinearScale,
    category: 'interactive',
});
registerComponent({
    type: 'ToggleButtons',
    component: ToggleInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        items: [
            { id: '1', label: 'test-1' },
            { id: '2', label: 'test-2' },
        ],
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: RadioButtonChecked,
    category: 'interactive',
});
registerComponent({
    type: 'Switch',
    component: SwitchInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: EditAttributes,
    category: 'interactive',
});
registerComponent({
    type: 'CheckBox',
    component: CheckBoxInputWrapper,
    defaultProps: {
        fullWidth: true,
        label: 'label',
        position: 'column',
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Check,
    category: 'interactive',
});
registerComponent({
    type: 'Select',
    component: SelectInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        items: [
            { id: '1', label: 'test-1' },
            { id: '2', label: 'test-2' },
        ],
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: ViewList,
    category: 'interactive',
});
registerComponent({
    type: 'AutoComplete',
    component: AutoCompleteInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        options: [
            { id: '1', label: 'пики' },
            { id: '2', label: 'стволы' },
        ],
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: FlashAuto,
    category: 'interactive',
});
registerComponent({
    type: 'File',
    component: FileInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        fullWidth: true,
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Description,
    category: 'interactive',
});

// карусели (донастроить)
registerComponent({
    type: 'HorizontCarousel',
    component: HorizontalCarouselWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
        style: {a:1},
        items: [
            <img
                src='https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg'

            />,
            <img style={{ width: '100%', height: 'auto' }} src='https://picsum.photos/600/600' alt="Slide 1" /> ,
            <img style={{ width: '100%', height: 'auto' }} src='https://picsum.photos/300/300' alt="Slide 1" /> 
        ]
    },
    icon: ViewCarousel,
    category: 'media',
});
registerComponent({
    type: 'PromoBanner',
    component: PromoBannerWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
    },
    icon: ViewCarousel,
    category: 'media',
});
registerComponent({
    type: 'MediaCarousel',
    component: MediaCarouselCustom,
    defaultProps: {
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplayDelay: 4000,
        loop: false,
        items: [
            { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
            { type: 'image', src: 'https://picsum.photos/seed/2/600/400' },
            { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/3/600/400' },
        ]
    },
    icon: ViewCarousel,
    category: 'media',
});
registerComponent({
    type: 'CarouselVertical',
    component: MediaCarouselVertical,
    defaultProps: {
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplayDelay: 4000,
        loop: false,
        items: [
            { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
            { type: 'image', src: 'https://picsum.photos/seed/2/600/400' },
            { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/3/600/400' },
        ]
    },
    icon: ViewCarousel,
    category: 'media',
});


// any
registerComponent({
    type: 'Divider',
    component: DividerWrapper,
    defaultProps: {
        fullWidth: true,
        variant: 'fullWidth',
        width: '100%',
    },
    icon: LinearScale,
    category: 'misc',
});
registerComponent({
    type: 'Avatar',
    component: AvatarWrapper,
    defaultProps: {
        fullWidth: true,
        sizes: 36,
        src: 'https://mui.com/static/images/avatar/3.jpg',
        file: '',
        icon: '',
        'data-source': 'src',
        style: {}
    },
    icon: LinearScale,
    category: 'misc',
});
registerComponent({
    type: 'Chip',
    component: ChipWrapper,
    defaultProps: {
        fullWidth: true,
        variant: '',
        size: 'small',
        color: '',
        icon: '',
        label: 'chip',
        style: {}
    },
    icon: LinearScale,
    category: 'misc',
});
registerComponent({
    type: 'Card',
    component: CardWrapper,
    defaultProps: {
        fullHeight: true,
        width: '100%',
        heightMedia: 'auto',
        src: '',
        file: '',
        'data-source': '',
        alt: undefined,
        slots: {
            title: undefined,
            subheader: undefined,
            text: undefined,
            image: undefined
        }
    },
    icon: LinearScale,
    category: 'media',
});


// complex
registerComponent({
    type: 'Accordion',
    component: AccordionWrapper,
    defaultProps: {
        fullWidth: true,
        activeIndexs: [],
        styles: {},
        items: [
            {
                title: serializeJSX(<Box sx={{ml: 1.5}}>・test-1</Box>),
                content: serializeJSX(<Box sx={{m: 3}}>content</Box>)
            }
        ]
    },
    icon: ListAlt,
    category: 'complex',
});
registerComponent({
    type: 'Tabs',
    component: TabsWrapper,
    defaultProps: {
        fullWidth: true,
        slots: {
            0: [],
            1: [],
            2: []
        },
        items: [
            'one',
            'two',
            'three'
        ]
    },
    icon: Repartition,
    category: 'complex',
});
registerComponent({
    type: 'BottomNav',
    component: BottomNavWrapper,
    defaultProps: {
        fullWidth: true,
        showLabels: false,
        elevation: 1,
        labelSize: 16,
        iconSize: 24,
        items: [
            {icon: 'Home', label: 'home'},
            {icon: 'Add', label: 'add'},
            {icon: 'Add', label: 'test'}
        ]
    },
    icon: Repartition,
    category: 'complex',
});
registerComponent({
    type: 'DataTable',
    component: DataTableWrapper,
    defaultProps: {
        fullWidth: true,
        sourceType: 'google',
        'data-source': 'table',
        file: '',
        source: '14Jy8ozyC4nmjopCdaCWBZ48eFrJE4BneWuA3CMrHodE',
        refreshInterval: 25000
    },
    icon: BackupTable,
    category: 'block',
});


registerComponent({
    type: 'AppBar',
    component: HeaderWrapper,
    defaultProps: {
        fullWidth: true,
        logo: '',
        file: '',
        'data-source': 'src',
        linkItems: [
            {id: 'test', label: 'test'},
            {id: 'settings', label: 'settings'}
        ],
        slots: {
            
        }
    },
    icon: Repartition,
    category: 'block',
});
registerComponent({
    type: 'Breadcrumbs',
    component: BreadcrumbsWrapper,
    defaultProps: {
        fullWidth: true,
        pathname: 'test/room/any',
        style: {}
    },
    icon: Repartition,
    category: 'block',
});