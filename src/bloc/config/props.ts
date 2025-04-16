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
    gutterBottom: [true, false], // Добавить нижний отступ
    noWrap: [true, false], // Отключить перенос строк
    paragraph: [true, false], // Сделать текст абзацем (добавляется дополнительный отступ снизу)
    display: ['initial', 'inline', 'block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid'], // Свойство display для управления отображением
    variantMapping: { // Маппинг типов для других компонентов
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        h6: 'h6',
        subtitle1: 'h6',
        subtitle2: 'h6',
        body1: 'p',
        body2: 'p',
        caption: 'span',
        overline: 'span',
        button: 'span',
        srOnly: 'span',
    }, // Связь с другими элементами
    component: 'elementType', // Тип компонента (например, 'div', 'span', 'a')
    children: 'ReactNode', // Контент внутри Typography
    sx: 'SxProps', // Стили через sx пропс
    className: 'string', // CSS класс
    style: 'CSSStyleDeclaration', // Инлайн стили
    id: 'string', // id элемента
}

const propsImage = {
    src: 'string',
    alt: 'string',
    sizes: 'string',
    imgixParams: 'object', // можно редактировать позже через JSON-форму
}



export default {
    Button: propsButton,
    IconButton: propsIconButton,
    Typography: propsTypography,
    Image: propsImage
}