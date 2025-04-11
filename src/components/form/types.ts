import { SxProps } from '@mui/material';
import { TextInputProps, NumberInputProps, SliderInputProps, SwitchInputProps,
    DataPickerInputProps, CheckBoxInputProps, ToogleeInputProps, ColorPickerProps, 
    SelectInputProps

} from '../input/index';


export type TypeSchema = 'text' | 'number' | 'date' | 'color' | 'time' | 'slider' 
| 'switch' | 'toggle' | 'select' | 'checkbox';



export interface Text extends TextInputProps {
    value?: string
    onChange?: (value: string)=> void
    validator?: (value: string)=> boolean
}
export interface Number extends NumberInputProps {
    validator?: (value: number)=> boolean
}
/** на самом деле button groop */
export interface Toogler extends ToogleeInputProps {
    //label: string | undefined
    position: 'column' | 'left' | 'right' | undefined
    validator?: (value: string | string[])=> boolean
}
export interface TextMultiline extends Text {
    multiline: true
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
    date: DataPickerInputProps          // ! тут отличие от основного есть
    color: ColorPickerProps
    time: DataPickerInputProps          // ! тут отличие от основного есть
    slider: SliderInputProps
    select: SelectInputProps
    switch: SwitchInputProps
    toggle: Toogler
    checkbox: CheckBoxInputProps
}


//export type Schema<T extends TypeSchema = TypeSchema> = BaseSchema & TypeToSchema[T];
export type Schema<T extends TypeSchema = TypeSchema> = BaseSchema & {
    type: T
    labelSx?: SxProps
} & TypeToSchema[T];




// ========================================= пример
const textInputTest: Schema<'text'> = {
    label: 'name',
    position: 'column',
    id: "username",
    type: "text",
    value: "John",
    onChange: (val)=> console.log(val),
    validator: (val)=> val.length > 3
}

const numberInputTest: Schema<'number'> = {
    label: 'number',
    position: 'column',
    id: "test",
    value: 1,
    onChange: (val)=> console.log(val),
    validator: (val)=> val > 0
}
