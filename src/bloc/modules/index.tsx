import { registerComponent } from './helpers/registry';
import { ButtonWrapper, IconButtonWrapper } from './buttons';
import { TypographyWrapper, TextWrapper } from './text';
import { ImageWrapper } from './media';
import { 
    Settings, Description, FlashAuto, ViewList, Check, EditAttributes,
    RadioButtonChecked, LinearScale, EventAvailable, Schedule, Exposure, TextFields, Create, Image,
    ViewCarousel, BackupTable, ListAlt, Repartition, EditNote, TableRows,
    VideoCameraFront, AccountBox, Label, Subtitles, StarsOutlined, Checklist, Title, AdsClick, RecentActors
 } from '@mui/icons-material';
import { TextInputWrapper, NumberInputWrapper, DateInputWrapper, SliderInputWrapper,
    ToggleInputWrapper, SwitchInputWrapper, CheckBoxInputWrapper, SelectInputWrapper,
    AutoCompleteInputWrapper, FileInputWrapper, 
} from './inputs';
import { HorizontalCarouselWrapper, VerticalCarouselWrapper, PromoBannerWrapper, VideoWrapper, CardWrapper, ShopCardWrapper } from './media';
import { DividerWrapper, AvatarWrapper, ChipWrapper, RatingWrapper, ListWrapper } from './any';
import { TabsWrapper, BottomNavWrapper, AccordionWrapper } from './complex';
import { HeaderWrapper, BreadcrumbsWrapper } from './shared';
import { DataTableWrapper } from './tables';
import { FrameWrapper, AreaWrapper } from './blocs';
import { FormAuthOrRegWrapper } from './forms';
import { sharedContext, sharedEmmiter } from './helpers/shared';





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
///////////////////////////////////////////////////////////////////////

// buttons
registerComponent({
    type: 'Button',
    component: ButtonWrapper,
    defaultProps: {
        fullWidth: true,
        children: 'Button',
        variant: 'outlined',
        size: 'medium',
        color: 'primary',
        startIcon: 'none',
        endIcon: 'none',
        style: {}
    },
    icon: AdsClick,
    category: 'interactive',
});
registerComponent({
    type: 'IconButton',
    component: IconButtonWrapper,
    defaultProps: {
        fullWidth: true,
        size: 'medium',
        color: 'default',
        icon: 'Add',
    },
    icon: AdsClick,
    category: 'interactive',
});


// инпуты
registerComponent({
    type: 'TextInput',
    component: TextInputWrapper,
    defaultProps: {
        fullWidth: true,
        label: 'label',
        name: 'text',
        position: 'column',
        placeholder: 'ввод',
        divider: 'none',
        leftIcon: 'none',
        min: 0,
        max: 0,
        multiline: false,
        styles: {},
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
        fullWidth: true,
        label: 'label',
        name: 'number',
        position: 'column',
        placeholder: 'ввод number',
        min: -10000,
        max: 10000,
        styles: {},
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
        fullWidth: true,
        label: 'label',
        name: 'time',
        position: 'column',
        type: 'time',
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
        fullWidth: true,
        label: 'label',
        name: 'date',
        position: 'column',
        type: 'date',
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
        fullWidth: true,
        marks: false,
        step: 1,
        min: 0,
        max: 100,
        label: 'label',
        name: 'slider',
        position: 'column',
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
        fullWidth: true,
        label: 'label',
        position: 'column',
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
        fullWidth: true,
        label: 'label',
        name: 'switch',
        position: 'column',
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
        name: 'check',
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
        fullWidth: true,
        label: 'label',
        name: 'select',
        position: 'column',
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
        fullWidth: true,
        label: 'label',
        name: 'select',
        position: 'column',
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
        fullWidth: true,
        label: 'label',
        name: 'file',
        position: 'column',
        labelStyle: {
            fontSize: 14,
        }
    },
    icon: Description,
    category: 'interactive',
});

// media
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
// карусели (донастроить)
registerComponent({
    type: 'HorizontCarousel',
    component: HorizontalCarouselWrapper,
    defaultProps: {
        fullWidth: true,
        autoplay: false,
        loop: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        delay: 4,
        width: '100%',
        items: [
            { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
            { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/1/300/400' },
            { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
            { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/1/800/400' },
        ]
    },
    icon: ViewCarousel,
    category: 'media',
});
registerComponent({
    type: 'VerticalCarousel',
    component: VerticalCarouselWrapper,
    defaultProps: {
        fullWidth: true,
        autoplay: false,
        loop: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        delay: 4,
        items: [
            { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
            { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/1/300/400' },
            { type: 'image', src: 'https://picsum.photos/seed/1/600/400' },
            { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { type: 'image', src: 'https://picsum.photos/seed/1/800/400' },
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
        'variant-button': 'outlined',
        'color-button': 'primary',
        'path-button': '',
        'children-button': 'go to',
        items: [{
            title: 'Title',
            buttonText: "ПОДРОБНЕЕ",
            description: 'custom editable description',
            images: [`https://placehold.co/600x400/353636/gray?text=Promoimage&font=roboto`]
        }]
    },
    icon: ViewCarousel,
    category: 'media',
});

// card
registerComponent({
    type: 'Card',
    component: CardWrapper,
    defaultProps: {
        fullHeight: true,
        width: '100%',
        elevation: 4,
        heightMedia: 'auto',
        src: '',
        file: '',
        'data-source': '',
        slots: {
            title: undefined,
            subheader: undefined,
            text: undefined,
        }
    },
    icon: Subtitles,
    category: 'media',
});
registerComponent({
    type: 'ShopCard',
    component: ShopCardWrapper,
    defaultProps: {
        fullHeight: true,
        width: '100%',
        elevation: 4,
        heightMedia: 'auto',
        src: '',
        file: '',
        'data-source': '',
        slots: {
            
        }
    },
    icon: Subtitles,
    category: 'media',
});


// misc
registerComponent({
    type: 'Typography',
    component: TypographyWrapper,
    defaultProps: {
        fullWidth: true,
        fontFamily: 'Roboto',
        variant: 'h5',
        textAlign: 'start',
        children: 'Заголовок',
        style: {
            display: 'flex',  
        }
    },
    icon: Title,
    category: 'misc',
});
registerComponent({
    type: 'Text',
    component: TextWrapper,
    defaultProps: {
        fullWidth: true,
    },
    icon: TextFields,
    category: 'misc',
});
registerComponent({
    type: 'Rating',
    component: RatingWrapper,
    defaultProps: {
        fullWidth: true,
        isHalf: false,
        size: 'medium',
        iconName: 'none',
        apiPath: 'api/test',
        colors: '#ff3d47'
    },
    icon: StarsOutlined,
    category: 'misc',
});
registerComponent({
    type: 'Divider',
    component: DividerWrapper,
    defaultProps: {
        fullWidth: true,
        isChildren: false,
        orientation: 'horizontal',
        variant: 'fullWidth',
        'border-style': 'solid',
        'border-color': null,
        children: 'divider'
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
    icon: AccountBox,
    category: 'misc',
});
registerComponent({
    type: 'Chip',
    component: ChipWrapper,
    defaultProps: {
        fullWidth: true,
        label: 'chip',
        variant: '',
        size: 'small',
        color: '',
        icon: '',
        style: {}
    },
    icon: Label,
    category: 'misc',
});
registerComponent({
    type: 'List',
    component: ListWrapper,
    defaultProps: {
        fullWidth: true,
        isButton: false,
        isSecondary: true,
        styles: {},
        items: [
            {
                startIcon: 'Settings',
                primary: 'primary',
                secondary: 'secondary'
            }
        ]
    },
    icon: Checklist,
    category: 'misc',
});


// complex
registerComponent({
    type: 'DataTable',
    component: DataTableWrapper,
    defaultProps: {
        fullWidth: true,
        sourceType: 'json',
        source: [{test: 1, name: 'test'}],
        header: '',
        file: '',
        refreshInterval: 25000
    },
    icon: BackupTable,
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


// blocks
registerComponent({
    type: 'Accordion',
    component: AccordionWrapper,
    defaultProps: {
        fullWidth: true,
        metaName: 'CustomAccordion',
        activeIndexs: [],
        styles: {},
        slots: {
            0: {}
        },
        items: [
            {
                title: '・title-0',
                content: 'content'
            }
        ]
    },
    icon: ViewList,
    category: 'block',
});
registerComponent({
    type: 'Tabs',
    component: TabsWrapper,
    defaultProps: {
        fullWidth: true,
        isHorizontal: true,
        alignTab: 'center',
        color: '',
        'select-color': '',
        metaName: 'CustomTabs',
        // ! ВСЕГДА ОБЬЕКТ 
        slots: {
            0: {},
            1: {},
            2: {}
        },
        items: [
            'one',
            'two',
            'three'
        ]
    },
    icon: Repartition,
    category: 'block',
});
registerComponent({
    type: 'Frame',
    component: FrameWrapper,
    defaultProps: {
        fullWidth: true,
        metaName: 'CustomFrame',
        elevation: 0,
        slots: {
            0: {}
        },
        style: {}
    },
    icon: TableRows,
    category: 'block',
});
registerComponent({
    type: 'Area',
    component: AreaWrapper,
    defaultProps: {
        fullWidth: true,
        metaName: 'AreaFrame',
        elevation: 0,
        slots: {
            0: {}
        },
        style: {}
    },
    icon: TableRows,
    category: 'block',
});
registerComponent({
    type: 'FormAuth',
    component: FormAuthOrRegWrapper,
    defaultProps: {
        fullWidth: true,
        metaName: 'FormAuth',
        style: {}
    },
    icon: EditNote,
    category: 'block',
});


// special 
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
    category: 'complex',
});
registerComponent({
    type: 'Breadcrumbs',
    component: BreadcrumbsWrapper,
    defaultProps: {
        fullWidth: true,
        fontSize: 16,
        separator: '/',
        pathname: 'test/room/any',
        style: {}
    },
    icon: Repartition,
    category: 'complex',
});