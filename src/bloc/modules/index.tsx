import React from 'react';
import { registerComponent } from './utils/registry';
import { ButtonWrapper, IconButtonWrapper } from './buttons';
import { TypographyWrapper, TextWrapper } from './text';
import { ImageWrapper } from './media';
import { 
    Settings, Description, FlashAuto, ViewList, Check, EditAttributes,
    RadioButtonChecked, LinearScale, EventAvailable, Schedule, Exposure, TextFields, Create, Image,
    ViewCarousel, BackupTable, ListAlt, Repartition, ViewQuilt
 } from '@mui/icons-material';
import { TextInputWrapper, NumberInputWrapper, DateInputWrapper, SliderInputWrapper,
    ToggleInputWrapper, SwitchInputWrapper, CheckBoxInputWrapper, SelectInputWrapper,
    AutoCompleteInputWrapper, FileInputWrapper
} from './inputs';
import { VerticalCarouselWrapper, HorizontalCarouselWrapper, PromoBannerWrapper } from './media';
import { DividerWrapper } from './any';
import { TabsWrapper, BottomNavWrapper, AccordionWrapper, DataTableWrapper } from './complex';
import { DataSourceTableProps } from './sources/table';
import { sharedContext, sharedEmmiter } from './utils/shared';
import { Box } from '@mui/material';
import { serializeJSX } from '../utils/sanitize';


/**
 * Приоритет: 
 * * пропс настройки компонентов 
 * * панель проектов 
 * * доработать редактор сетки
 * * 
 */
//////////////////////////////////////////////////////////////////////
globalThis.EDITOR = true;       // мы в контексте редактора
globalThis.sharedContext = sharedContext;
globalThis.sharedEmmiter = sharedEmmiter;
// глобальный список шрифтов
globalThis.FONT_OPTIONS = [
    'inherit',
    'Roboto',
    'Arial',
    'Georgia',
    'Times New Roman',
    'Inter',
    'Montserrat',
];
///////////////////////////////////////////////////////////////////////


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
    icon: TextFields,
    category: 'interactive',
});
registerComponent({
    type: 'Text',
    component: TextWrapper,
    defaultProps: {
        children: '',
        fullWidth: true,
    },
    icon: TextFields,
    category: 'interactive',
});

registerComponent({
    type: 'Image',
    component: ImageWrapper,
    defaultProps: {
        src: 'https://cs5.pikabu.ru/post_img/big/2015/06/04/11/1433446202_1725992411.jpg',
        alt: 'Картинка',
    },
    icon: Image,
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

// инпуты
registerComponent({
    type: 'TextInput',
    component: TextInputWrapper,
    defaultProps: {
        label: 'label',
        position: 'column',
        placeholder: 'ввод',
        fullWidth: true,
        width: '100%',
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
        width: '100%',
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
        width: '100%',
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
        width: '100%',
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
        width: '100%',
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
        width: '100%',
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
        width: '100%',
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
        label: 'label',
        position: 'column',
        fullWidth: true,
        width: '100%',
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
        width: '100%',
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
        width: '100%',
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
        width: '100%',
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Description,
    category: 'interactive',
});

// карусели (донастроить)
registerComponent({
    type: 'VerticalCarousel',
    component: VerticalCarouselWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
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


// any
registerComponent({
    type: 'Divider',
    component: DividerWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
    },
    icon: LinearScale,
    category: 'misc',
});


// complex
registerComponent({
    type: 'Accordion',
    component: AccordionWrapper,
    defaultProps: {
        fullWidth: true,
        width: '100%',
        activeIndexs: [],
        items: [
            {
                title: serializeJSX(<Box sx={{ml: 1.5}}>・test-1</Box>),
                content: serializeJSX(<Box sx={{m: 3}}>content</Box>)
            },
            {
                title: serializeJSX(<Box sx={{ml: 1.5}}>・test-2</Box>),
                content: serializeJSX(<Box sx={{m: 3}}>content</Box>)
            },
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
        width: '100%',
        items: [
            'one',
            'two',
            'three',
            'any position'
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
        width: '100%',
        items: [
            {icon: 'Home'},
            {icon: 'Add'},
            {icon: 'Settings'},
            {icon: 'Close'},
            {icon: 'Menu'}
        ]
    },
    icon: Repartition,
    category: 'complex',
});
// data table
registerComponent({
    type: 'DataTable',
    component: DataTableWrapper,
    defaultProps: {
        sourceType: 'google',
        source: '14Jy8ozyC4nmjopCdaCWBZ48eFrJE4BneWuA3CMrHodE',
        refreshInterval: 25000
    } satisfies DataSourceTableProps,
    icon: BackupTable,
    category: 'complex',
});
