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
// классы для ячеек
export const AVAILABLE_CLASSNAMES = ['rounded'];


/**
 * ---------------------------------------------
 * пропсы компонентов
 * ---------------------------------------------
 */
const propsButton = {
    
}
const propsIconButton = {
    
}
const propsTypography = {
    variant: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'overline', 'button', 'srOnly'], // Типы текста
    align: ['left', 'center', 'right', 'justify'], // Выравнивание текста 'inherit', 
    color: ['initial', 'textPrimary', 'textSecondary', 'error', 'primary', 'secondary', 'inherit'], // Цвет текста
    noWrap: [true, false], // Отключить перенос строк
    fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS },
    fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
    //display: ['initial', 'inline', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid'], // Свойство display для управления отображением
    textAlign: {
        type: 'toggle', items: [
            { id: 'left', label: 'left' },
            { id: 'center', label: 'center' },
            { id: 'right', label: 'right' },
            { id: 'justify', label: 'justify' }
        ]
    }
}
const propsDivider = {
    variant: ["inset", "fullWidth", "middle"],
    'border-style': ['solid', 'dashed', 'dotted'],
    color: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'],
    orientation: ["horizontal", "vertical"]
}
const propsChip = {
    variant: ['filled', 'outlined'],

}
const propsRating = {
    colors: { type: 'color' },
    apiPath: { type: 'text' },
    isHalf: { type: 'switch' }
}
const propsBottomNav = {
    showLabels: [true, false],
    elevation: { type: 'slider', min: 0, max: 12, step: 1 },
    labelSize: { type: 'slider', min: 8, max: 48, step: 1 },
    iconSize: { type: 'slider', min: 8, max: 48, step: 1 },
}


const propsImage = {
    src: 'string',
    alt: 'string',
    sizes: 'string'
}
const propsCard = {
    src: 'string',
    alt: 'string',
    heightMedia: 'number'
}

const propsInput = {
    label: 'string',
    position: ['none', 'column', 'left', 'right'],
    divider: ['none', 'solid', 'dashed', 'dotted'],
    placeholder: 'string',
    leftIcon: 'string',
    //! композитный тип
    styles: {
        form: {
            borderStyle: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
            borderColor: { type: 'color' },
            background: { type: 'color' }
        },
        placeholder: {
              // типы которые применяются как преформа
            color: { type: 'color' },
            opacity: { type: 'slider', min: 0, max: 1, step: 0.01 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS }
        },
        label: {
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS }
        },
        icon: {
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            opacity: { type: 'slider', min: 0, max: 1, step: 0.01 },
            color: { type: 'color' }
        }
    }
}
const propsInputFile = {
    ...propsInput,
}
const propsInputAutocomplete = {
    ...propsInput,
}
const propsInputSlider = {
    label: 'string',
    marks: { type: 'switch' },
    position: ['none', 'column', 'left', 'right'],
    leftIcon: 'string',
    rightIcon: 'string',
    styles: {
        label: {
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS }
        },
        thumb: {
            height: { type: 'slider', min: 8, max: 48, step: 1 },
            width: { type: 'slider', min: 8, max: 48, step: 1 },
            backgroundColor: { type: 'color' },
            borderColor: { type: 'color' },
        },
        track: {
            backgroundColor: { type: 'color' }
        },
        rail: {
            backgroundColor: { type: 'color' },
            borderColor: { type: 'color' },
        }
    }
}
const propsInputToogle = {
    label: 'string',
    position: ['none', 'column', 'left', 'right'],
    styles: {
        label: {
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS }
        },
        form: {
            borderStyle: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
            borderColor: { type: 'color' },
            background: { type: 'color' },
        },
        button: {
            backgroundColor: { type: 'color' },
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
        }
    }
}
const propsInputCheck = {
    label: 'string',
    position: ['none', 'column', 'left', 'right'],
    styles: {
        label: {
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS }
        },
        form: {
            borderColor: { type: 'color' },
            colorSuccess: { type: 'color' }
        }
    }
}
const propsInputSwitch = {
    label: 'string',
    position: ['none', 'column', 'left', 'right'],
    styles: {
        label: {
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS }
        },
        form: {
            borderColor: { type: 'color' },
            backgroundColor: { type: 'color' }
        },
        thumb: {
            height: { type: 'slider', min: 8, max: 48, step: 1 },
            width: { type: 'slider', min: 8, max: 48, step: 1 },
            backgroundColor: { type: 'color' },
            borderColor: { type: 'color' },
        }
    }
}
const propsAcordeon = {
    styles: {
        title: {
            borderStyle: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
            borderColor: { type: 'color' },
            background: { type: 'color' },
            borderRadius: { type: 'slider', min: 0, max: 30, step: 1 },
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 2 },
            paddingLeft: { type: 'slider', min: 0, max: 30, step: 1 },
        },
        body: {
            paddingTop: { type: 'slider', min: 0, max: 30, step: 1 },
            paddingBottom: { type: 'slider', min: 0, max: 30, step: 1 },
            paddingLeft: { type: 'slider', min: 0, max: 30, step: 1 },
            paddingRight: { type: 'slider', min: 0, max: 30, step: 1 },
        }
    }
}
const propsPromoBaner = {
    styles: {
       dot: {
            activeColor: { type: 'color' },
            color: { type: 'color' },
            size: { type: 'slider', min: 14, max: 48, step: 2 }
        }
    },
    'variant-button': ['text', 'outlined', 'contained'],
    'color-button': ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'], 
    'path-button': { type: 'text' },
    'children-button': { type: 'text' },
}

const breadCrumbsProps = {
    fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
}
const propsStack = {
    count: { type: 'number', min: 2, max: 8, step: 1 },
}
const propsCarousel = {
    slidesToShow: { type: 'number', min: 1, max: 8, step: 1 }
}
const propsTabs = {
    alignTab: ['start', 'center', 'end']
}
const propsDataTable = {
    sourceType: ['json', 'supabase']
}


export default {
    Button: propsButton,
    IconButton: propsIconButton,
    Typography: propsTypography,
    Image: propsImage,
    TextInput: propsInput,
    Number: propsInput,
    Time: propsInput,
    Date: propsInput,
    Select: propsInput,
    File: propsInputFile,
    AutoComplete: propsInputAutocomplete,
    Slider: propsInputSlider,
    ToggleButtons: propsInputToogle,
    CheckBox: propsInputCheck,
    Switch: propsInputSwitch,
    Card: propsCard,
    Accordion: propsAcordeon,
    Divider: propsDivider,
    Chip: propsChip,
    BottomNav: propsBottomNav,
    PromoBanner: propsPromoBaner,
    Stack: propsStack,
    Rating: propsRating,
    HorizontCarousel: propsCarousel,
    VerticalCarousel: propsCarousel,
    Breadcrumbs: breadCrumbsProps,
    Tabs: propsTabs,
    DataTable: propsDataTable,
}