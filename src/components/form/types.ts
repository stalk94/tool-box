import { DividerProps, SxProps } from '@mui/material';
import { TextInputProps, NumberInputProps, SliderInputProps, SwitchInputProps,
    DataPickerInputProps, CheckBoxInputProps, ToogleeInputProps, ColorPickerProps, 
    SelectInputProps, FileLoaderProps, AutoCompleteProps
} from '../input/index';


export type TypeSchema = 'text' | 'number' | 'date' | 'color' | 'time' | 'slider' | 'file' | 'file-combo'
| 'switch' | 'toggle' | 'select' | 'checkbox' | 'autocomplete' | 'divider';


type OmitText = Omit<TextInputProps, 'onChange' | 'value'>
export interface Text extends OmitText {
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
    labelSx?: SxProps
}
type TypeToSchema = {
    text: Text
    number: Number
    date: DataPickerInputProps          // ! тут отличие от основного есть
    color: ColorPickerProps
    time: DataPickerInputProps          // ! тут отличие от основного есть
    slider: SliderInputProps
    select: SelectInputProps
    switch: SwitchInputProps
    toggle: Toogler
    checkbox: CheckBoxInputProps
    file: FileLoaderProps 
    autocomplete: AutoCompleteProps
    'file-combo': any
    divider: DividerProps
}


export type Schema<T extends TypeSchema = TypeSchema> = BaseSchema & TypeToSchema[T];




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
    type: 'number',
    onChange: (val)=> console.log(val),
    validator: (val)=> val > 0
}
