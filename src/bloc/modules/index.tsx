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
import { HorizontalCarouselWrapper, VerticalCarouselWrapper, PromoBannerWrapper, VideoWrapper, CardWrapper } from './media';
import { DividerWrapper, AvatarWrapper, ChipWrapper, RatingWrapper } from './any';
import { TabsWrapper, BottomNavWrapper, AccordionWrapper, DataTableWrapper, 
    HeaderWrapper, BreadcrumbsWrapper, ListWrapper 
} from './complex';
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
        children: 'Button',
        variant: 'outlined',
        color: 'primary',
        fullWidth: true,
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
        icon: 'Add',
        color: 'default',
    },
    icon: AdsClick,
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



// misc
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
        size: 'medium',
        iconName: 'none',
        apiPath: 'api/test',
        colors: '#ff3d47',
        precision: 1
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
        variant: 'fullWidth',
        width: '100%',
        children: 'text'
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
        variant: '',
        size: 'small',
        color: '',
        icon: '',
        label: 'chip',
        style: {}
    },
    icon: Label,
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
    icon: Subtitles,
    category: 'media',
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
        sourceType: 'google',
        'data-source': 'table',
        file: '',
        source: '14Jy8ozyC4nmjopCdaCWBZ48eFrJE4BneWuA3CMrHodE',
        refreshInterval: 25000
    },
    icon: BackupTable,
    category: 'complex',
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
    category: 'complex',
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
    category: 'complex',
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