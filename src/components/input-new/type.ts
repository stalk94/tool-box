export type LabelsSliderProps = {
    children: any
    labelLeft?: string | React.ReactElement
    labelRight?: string | React.ReactElement
}

export type ValidatorProps = {
    pattern: string
    min?: string | number
    max?: string | number
    step?: string | number
    minlength?: string | number
    maxlength?: string | number
}
type ValidatorByType = {
    text: Pick<ValidatorProps, 'pattern' | 'minlength' | 'maxlength'>;
    password: Pick<ValidatorProps, 'pattern' | 'minlength' | 'maxlength'>;
    email: Pick<ValidatorProps, 'pattern' | 'minlength' | 'maxlength'>;
    number: Pick<ValidatorProps, 'min' | 'max' | 'step'>;
    date: Pick<ValidatorProps, 'min' | 'max'>;
    range: Pick<ValidatorProps, 'min' | 'max' | 'step'>;
    textarea: Pick<ValidatorProps, 'minlength' | 'maxlength'>;
}


export type BaseProps = {
    'data-id'?: string | number
    fullWidth?: boolean
    required?: boolean
    type: 'text' | 'number' | 'email' | 'password' | 'date' | 'textarea' | 'tel' | 'url' | 'time' | 'datetime-local' | 'search'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    placeholder: string
    labelLeft?: string | React.ReactElement
    labelRight?: string | React.ReactElement
    labelTop?: string | React.ReactElement
    validator?: string | React.ReactElement | boolean
    color?: string
    /** tooltip текст подсказка при наведении */
    title?: string
    value?: string | number
    style?: React.CSSProperties
    onChange?: (val: string)=> void
}

export type NumberInputProps = BaseProps & {
    type?: 'number'
    iconEnable?: boolean
    value?: number
    step?: number
    onChange?: (val: number)=> void
}

export type FileInputProps = {
    'data-id'?: string | number
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    value?: number
    onChange?: (val: any)=> void
    accept?: string
}

export type SelectInputProps = Omit<BaseProps, 'labelRight'> & {
    value?: string
    onChange?: (val: string)=> void
    items?: string[]
}

export type CheckBoxInputProps = {
    'data-id'?: string | number
    onChange?: (val: boolean)=> void
    value?: boolean 
    type?: 'checkbox' | 'toggle' | 'radio'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    labelLeft?: string | React.ReactElement
    labelRight?: string | React.ReactElement
    labelTop?: string | React.ReactElement
}

export type SliderInputProps = {
    'data-id'?: string | number
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    labelLeft?: string | React.ReactElement
    labelRight?: string | React.ReactElement
    labelTop?: string | React.ReactElement
    value?: number | number[]
    onChange?: (val: number | number[])=> void
    onChangeEnd?: (val: number)=> void
    min?: number
    max?: number
    step?: number
}