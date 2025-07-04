import type { InputBaseProps } from '@mui/material/InputBase';
import type { 
    SliderProps, AutocompleteProps, SxProps, ToggleButtonOwnProps, 
    ToggleButtonGroupProps, CheckboxProps, SwitchProps 
} from '@mui/material';
import type { NavLinkItemSlider } from '../menu/type';
import type { RgbaColor } from 'react-colorful';


export type StylesProps = {
    icon?: {
        color?: string
        fontSize?: string | number
    }
    form?: {
        borderStyle?: "inset" | "dashed" | "solid" | "dotted" | "none" | "double" | "groove" | "outset" | "ridge"
        borderColor?: string
        background?: string
    }
    button?: React.CSSProperties
    placeholder?: React.CSSProperties
    label?: React.CSSProperties             // в checkbox
}

export type LabelTextProps = {
    /** ❗ не передав `label` инпут будет без label */
    label?:  React.ReactNode
    /** не передав `position` label не отрисуется но будет лишняя обертка, по этому лучше не передать `label` */
    position?: 'left' | 'right' | 'column'
    labelSx?: SxProps
}

//////////////////////////////////////////////////////////////////////////////////
// 
//////////////////////////////////////////////////////////////////////////////////
export type TextInputProps = {
    min?: number
    max?: number
    step?: number
    left?: any 
    right?: any 
    placeholder?: string
    label?: string
    children?: React.ReactNode
    variant?: "fullWidth" | "inset" | "middle"
    value?: string | number
    onChange?: (value: string | number)=> void
    success?: boolean
    borderStyle?: 'dashed' | 'solid' | 'dotted'
    divider?: 'none' | 'dashed' | 'solid' | 'dotted'
    styles?: StylesProps
} & InputBaseProps

export type NumberInputProps = {
    value?: number
    min?: number
    max?: number
    step?: number
    onChange?: (value: number) => void
    styles?: StylesProps
} & InputBaseProps

export type CustomSliderProps = SliderProps & {
    value?: number|number[]
    onChange: (value: number|number[])=> void,
    start?: React.ReactNode
    end?: React.ReactNode
    styles: {
        thumb: React.CSSProperties,
        track: React.CSSProperties,
        rail: React.CSSProperties
    }
}

export type SelectProps = {
    value: any
    left?: number
    onChange?: (newValue: string)=> void
    items: NavLinkItemSlider[]
    placeholder?: string
    position?: 'start' | 'end'
    onlyId?: boolean
    variant: "fullWidth" | "inset" | "middle"
    borderStyle?: 'dashed' | 'solid' | 'dotted'
    styles?: StylesProps 
}

type AutoCompleteOption = string | { label: string; id: string }
type MuiAutocompleteProps = Omit<AutocompleteProps<any, boolean, boolean, boolean>, 'renderInput'>
export type AutoCompleteProps =  MuiAutocompleteProps & {
    label?: React.ReactNode
    left?: any
    position?: 'left' | 'right' | 'column'
    options: AutoCompleteOption[]
    value?: any
    onChange?: (value: any) => void
    placeholder?: string
    styles?: StylesProps 
}

export type PasswordInputProps = InputBaseProps & {
    value: string
    left?: any
    onChange: (value: string) => void
    useVerify?: (val: string) => { result: boolean; helperText?: string }
    helperText?: string
    disabled?: boolean
    placeholder?: string
    styles?: StylesProps
}

export type LoginInputProps = InputBaseProps & {
    value: string
    left?: any
    useVerify: (value: string)=> {
        result: boolean,
        helperText?: string 
    }
    helperText?: string
    onChange: (value: string)=> void
    styles?: StylesProps
}

export type ColorWindowProps = {
    color: RgbaColor, 
    onChange: (val: RgbaColor)=> void, 
    sx?: SxProps
}
export type ColorPickerProps = InputBaseProps & {
    value?: string
    onChange?: (value: string)=> void
    /** включить ли кнопку копирования данных ввода */
    showCopy?: boolean,
    variant?: 'popup' | 'modal' | 'custom'
}

export type DateTimeInputProps = {
    value?: string;
    onChange?: (value: string) => void;
    type?: 'date' | 'time';
    variant?: 'modal' | 'popup';
    format?: string;
    placeholder?: string;
    disabled?: boolean;
    styles?: StylesProps
}
//////////////////////////////////////////////////////////////////////////////////
//          FILE LOADERS
//////////////////////////////////////////////////////////////////////////////////
export type FileLoaderProps = {
    value?: File | File[]
    onChange: (files: File[] | File) => void
    onUpload: (files: File[] | File) => void
    accept?: string
    multiple?: boolean
    maxSize?: number      // в байтах
    disabled?: boolean
    placeholder?: string
    styles?: StylesProps
}
export type SimpleFileLoaderProps = {
    children: React.ReactNode
    onUpload: (files: File[] | File) => void
    accept?: string
    multiple?: boolean
    maxSize?: number; // в байтах (например, 5 * 1024 * 1024)
    onReject?: (reason: string) => void
    style?: React.CSSProperties
    className?: string
    dragActiveClassName?: string
}
export type ComboLoaderProps = {
    value?: File
    left?: any
    styles?: StylesProps
    sx?: SxProps
    onChange: (path: string)=> void
}
//////////////////////////////////////////////////////////////////////////////////
//          ANY
//////////////////////////////////////////////////////////////////////////////////
export type EmailInputProps = InputBaseProps & {
    value: string
    left?: any
    onChange: (value: string) => void
    error?: boolean
    helperText?: string
    disabled?: boolean
    placeholder?: string
    styles?: StylesProps
    useVerify?: (value: string)=> {
        result: boolean
        helperText?: string 
    }
}
export type PhoneInputProps = InputBaseProps & {
    value: string
    left?: any
    onChange: (value: string) => void
    error?: boolean
    helperText?: string
    disabled?: boolean
    placeholder?: string
    styles?: StylesProps
    useVerify?: (value: string)=> {
        result: boolean
        helperText?: string 
    }
}
export type TooglerInputProps = ToggleButtonGroupProps & {
    value?: string | string[]
    isColapsed?: boolean
    /** множественный выбор */
    multi: boolean
    label: string
    styles?: StylesProps
    items: (ToggleButtonOwnProps & {
        label: string  | React.ReactNode
        id: string 
    })[]
    onChange?: (value: string | string[])=> void
}
export type CheckBoxInputProps = CheckboxProps & {
    value?: boolean
    label?: React.ReactNode
    styles?: StylesProps
    onChange?: (value: boolean)=> void
}
export type SwitchInputProps = SwitchProps & { 
    value?: boolean
    label?: string | React.ReactNode
    styles?: StylesProps
    style?: React.CSSProperties
    labelSx?: React.CSSProperties
    onChange: (v:boolean)=> void 
}
export type ChekBoxAgrementProps = CheckBoxInputProps & {
    useVerify?: (value: string)=> {
        result: boolean,
        helperText?: string 
    }
    linkUrl?: React.ReactElement
    agrement?: string
    helperText?: string
}
