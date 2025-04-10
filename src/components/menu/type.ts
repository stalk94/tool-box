
export type StateNavLinks = {
    /** данные для badge */
    badge?: number | React.ReactNode
}


/**
 * Схема для строителя навигационных списков
 */
export interface NavLinkItem {
    id: string
    label?: string
    icon?: React.ReactNode
    /** 🔥 кастомный параметр подсветит элемент как выбранный */
    select?: any
    comand?: (item: any) => void
    divider?: React.ReactNode | boolean
    /** ℹ️ можно передавать доп данные элемента */
    state?: StateNavLinks
    /** вложенные элементы */
    children?: NavLinkItem[]
}