import Slider, { SliderProps } from '@mui/material/Slider';
import { NavLinkItem } from '../menu/list';
import { TooglerProps } from '../input/input.any';
import { DataPickerCustomProps } from '../input/input.date';

//? не реализованы: 'slider' | 'switch' | 'toogle' | 'slider'
export type TypeSchema = 'text' | 'number' | 'date' | 'color' | 'time' | 'slider' 
| 'switch' | 'toggle' | 'select' | 'checkbox';



interface Base {
    label?: string | undefined
    position?: 'column' | 'left' | 'right' | undefined
}

export interface Text extends Base {
    value?: string
    onChange?: (value: string)=> void
    validator?: (value: string)=> boolean
}
export interface Number extends Base {
    value?: number
    min?: number
    max?: number 
    step?: number
    onChange?: (value: number)=> void
    validator?: (value: number)=> boolean
}
export interface Switch extends Base {
    value?: boolean
    onChange?: (value: boolean)=> void
}
export interface Checkbox extends Base {
    value?: boolean
    onChange?: (value: boolean)=> void
}
/** на самом деле button groop */
export interface Toogler extends TooglerProps {
    //label: string | undefined
    position: 'column' | 'left' | 'right' | undefined
    validator?: (value: string | string[])=> boolean
}
export interface TextMultiline extends Text {
    multiline: true
}
export interface Color extends Text {
}
export interface Time extends Text {
}
export interface Date extends Text {
}
export interface Slider extends SliderProps {
    value: any,
    items: NavLinkItem[]
}
export interface Select extends Text {
}



type BaseSchema = {
    /** ! имя ключа инпута должно быть уникальным, лучше всего id давать */
    id: string
    /** тип инпута */
    type: TypeSchema
}
type TypeToSchema = {
    text: Text
    multiText: TextMultiline
    number: Number
    date: Date
    color: Color
    time: Time
    slider: Slider
    select: Select
    switch: Switch
    toggle: Toogler
    checkbox: Checkbox
}


//export type Schema<T extends TypeSchema = TypeSchema> = BaseSchema & TypeToSchema[T];
export type Schema<T extends TypeSchema = TypeSchema> = BaseSchema & {
    type: T
} & TypeToSchema[T];


// =========================================
const textInputTest: Schema<'text'> = {
    label: 'name',
    position: 'column',
    id: "username",
    type: "text",
    value: "John",
    onChange: (val)=> console.log(val),
    validator: (val)=> val.length > 3
}


