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


/**
 * ---------------------------------------------
 * пропсы компонентов
 * ---------------------------------------------
 */
const propsButton = {
    variant: ['text', 'outlined', 'contained'], // Стиль кнопки
    color: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'], // Цвета
    size: ['small', 'medium', 'large'], // Размеры
    disabled: [true, false], // Отключение кнопки
    fullWidth: [true, false], // Растянуть на 100%
    //type: ['button', 'submit', 'reset'], // Тип HTML-кнопки
    startIcon: 'ReactNode', // Иконка до текста (например, <SaveIcon />)
    endIcon: 'ReactNode', // Иконка после текста
    onClick: 'function', // Обработчик клика
    href: 'string', // Ссылка (если кнопка как ссылка)
    component: 'elementType', // Например, Link из react-router
    children: 'ReactNode', // Текст или элементы внутри кнопки
    sx: 'SxProps', // Стили через sx пропс
    className: 'string', // CSS класс
    style: 'CSSStyleDeclaration', // Инлайн стили
    id: 'string', // id элемента
    disableElevation: [true, false], // Убрать тень у кнопки (только для contained)
    disableRipple: [true, false], // Убрать ripple-эффект при клике
    disableFocusRipple: [true, false], // Убрать ripple при фокусе
}
const propsIconButton = {
    color: ['default', 'inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'], // Цвет
    size: ['small', 'medium', 'large'], // Размер
    edge: [false, 'start', 'end'], // Смещение к краю контейнера
    disabled: [true, false], // Отключение
    onClick: 'function', // Обработчик клика
    children: 'ReactNode', // Иконка внутри
    href: 'string', // Если нужна ссылка
    component: 'elementType', // Например, Link из react-router
    sx: 'SxProps', // Стили через sx
    className: 'string', // CSS-класс
    style: 'CSSStyleDeclaration', // Инлайн стили
    id: 'string', // id элемента
    disableFocusRipple: [true, false], // Отключить ripple при фокусе
    disableRipple: [true, false], // Отключить ripple-эффект
}
const propsTypography = {
    variant: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'overline', 'button', 'srOnly'], // Типы текста
    align: ['left', 'center', 'right', 'justify'], // Выравнивание текста 'inherit', 
    color: ['initial', 'textPrimary', 'textSecondary', 'error', 'primary', 'secondary', 'inherit'], // Цвет текста
    noWrap: [true, false], // Отключить перенос строк
    display: ['initial', 'inline', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid'], // Свойство display для управления отображением
    styles: {
        text: {
            color: { type: 'color' },
            fontSize: { type: 'slider', min: 8, max: 48, step: 1 },
            fontFamily: { type: 'autocomplete', options: globalThis.FONT_OPTIONS },
            textAlign: { type: 'toggle', items: [
                { id: 'none', label: 'none' },
                { id: 'left', label: 'left' },
                { id: 'center', label: 'center' },
                { id: 'right', label: 'right' },
                { id: 'justify', label: 'justify' }
            ] }
        }
    }
}
const propsDivider = {
    variant: ["inset", "fullWidth", "middle"],
    color: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'],
    orientation: ["horizontal", "vertical"]
}
const propsChip = {
    variant: ['filled', 'outlined'],

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
    Chip: propsChip
}