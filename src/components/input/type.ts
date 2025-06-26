

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
    placeholder?: React.CSSProperties,

}