export interface BaseType {
    display: "block" | "inline" | "inline-block" | "flex" | "grid" | "none" | "contents" | "hidden"
    width: string
    height: string
    background: string
    backgroundColor: string
    color: string
    margin?: string
    marginLeft?: string
    marginRight?: string
    marginTop?: string
    marginBottom?: string
    padding: string
    paddingLeft?: string
    paddingRight?: string
    paddingTop?: string
    paddingBottom?: string
    textAlign: "left" | "right" | "justify" | "start" | "end" | 'center'
    borderRadius: string
}

export interface FlexType extends BaseType {
    flexDirection?: "column" | "row" | "row-reverse" | "column-reverse",
    flexWrap?: "nowrap" | "wrap" | "wrap-reverse", // Определяет, должны ли элементы перетекать на новую строку или колонку
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly", // Выравнивание элементов по основной оси
    alignItems?: "stretch" | "flex-start" | "flex-end" | "center" | "baseline", // Выравнивание элементов по поперечной оси
    alignContent?: "stretch" | "flex-start" | "flex-end" | "center" | "space-between" | "space-around", // Выравнивание строк по поперечной оси
    alignSelf?: "auto" | "stretch" | "flex-start" | "flex-end" | "center" | "baseline", // Выравнивание конкретного элемента по поперечной оси
    flexGrow?: number, // Описание способности элемента расширяться
    flexShrink?: number, // Описание способности элемента сжиматься
    flexBasis?: string, // Начальная длина элемента до применения flex-grow или flex-shrink
    flex?: string, // Краткая запись для flexGrow, flexShrink и flexBasis
    order?: number, // Задает порядок элементов внутри флекс-контейнера
    gap?: string, // Расстояние между флекс-элементами
}

export interface TextType extends BaseType {
    fontFamily: string
    fontWeigh: string 
    fontSize: string
    letterSpacing: string
    wordSpacing: string
    fontStyle: "normal" | "italic" | "oblique"

    textAlign: "left" | "right" | "center" | "justify" | "start" | "end"
    textOverflow: "clip" | "ellipsis"
    textTransform: "lowercase" | "capitalize" | "none" | "uppercase"

    textDecoration: "line-through" | "none" | "overline" | "underline"
    textDecorationStyle: "solid" | "double" | "dotted" | "dashed" | "wavy"
    textDecorationThickness: string
    textDecorationColor: string
  
    overflowWrap: "normal" | "break-word"
    whiteSpace: "normal" | "pre" | "nowrap" | "pre-wrap" | "pre-line"
    verticalAlign: "baseline" | "top" | "bottom" | "middle" | "sub" | "super" | "text-top" | "text-bottom"
    wordBreak: "normal" | "break-all" | "keep-all" | "break-word"
  
    direction: "ltr" | "rtl"
    unicodeBidi: "normal" | "embed" | "bidi-override"
    textShadow: string
}

export type PropsTypesEditor = 'color'
    | 'variant'
    | 'children'
    | 'size'
    | 'startIcon'
    | 'endIcon'
    | 'display'
    | 'align'
    | 'fullWidth'
    | 'type'
    | 'icon'
    | 'src'
    | 'alt'
    | 'sizes'
    | 'labelPosition'

export type RegistreTypeComponent = 'Button'
    | 'IconButton'
    | 'Image'
    | 'Typography'
    | 'Text'
    | 'TextInput'
    | 'Number'
    | 'Time'
    | 'Date'
    | 'Slider'
    | 'ToggleButtons'
    | 'Switch'
    | 'CheckBox'
    | 'Select'
    | 'AutoComplete'
    | 'File'
    | 'Video'
    | 'VerticalCarousel'
    | 'HorizontCarousel'
    | 'PromoBanner'
    | 'MediaCarousel'
    | 'Divider'
    | 'Accordion'
    | 'Tabs'
    | 'BottomNav'
    | 'DataTable'
    | 'Avatar'
    | 'Frame'
    | 'Area'
    | 'Rating'
    | 'List'

    
export type BoxSide = 'top' | 'right' | 'bottom' | 'left';

export type BorderInfo = {
    side: BoxSide
    isVisible: boolean;
    width: string;
    style: string;
    color: string;
}
export type SpacingInfo = {
    side: BoxSide
    value: string
    isSet: boolean
}