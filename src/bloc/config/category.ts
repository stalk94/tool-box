import { iconsList } from '../../components/tools/icons';
import { Palette, TouchApp, Photo, Layers, Widgets, Launch, Settings, Save, List, Functions } from '@mui/icons-material';
import { LuBlocks } from "react-icons/lu";
import { MdOutlineWidgets } from "react-icons/md";


// список категорий компонентов
export const componentGroups = {
    misc: {
        label: 'Прочее',
        icon: Widgets,
    },
    interactive: {
        label: 'Интерактивные',
        icon: TouchApp,
    },
    media: {
        label: 'Медиа',
        icon: Photo,
    },
    complex: {
        label: 'Сложные блоки',
        icon: Layers,
    },
    block: {
        label: 'Блоковые',
        icon: Launch,
    },
}
export const componentAtom = {
    blank: {
        label: 'Базовые блоки',
        icon: LuBlocks,
    },
    widget: {
        label: 'Интерактивные',
        icon: MdOutlineWidgets,
    },
}
export const componentBlock = {
    favorite: {
        label: 'Сохраненные',
        icon: Save,
    },
    any: {
        label: 'Базовые блоки',
        icon: LuBlocks,
    }
}
export const settingsBlock = {
    all: {
        label: '',
        icon: List
    },
    style: {
        label: '',
        icon: Palette
    }
}

///////////////////////////////////////////////////////////////////////
//                  Settings mod
///////////////////////////////////////////////////////////////////////
// список настроек темы
export const componentThemeSettings = {
    inputs: {
        label: '',
        icon: TouchApp,
    },
    interactive: {
        label: '',
        icon: TouchApp,
    },
    media: {
        label: 'Медиа',
        icon: Photo,
    },
    complex: {
        label: '',
        icon: Layers,
    },
    block: {
        label: '',
        icon: Launch,
    },
}
// список категорий базовых настроек
export const componentBaseSettings = {
    any: {
        label: '',
        icon: Settings,
    },
}
// список категорий action main
export const categoryActions = {
    all: {
        label: '',
        icon: Functions
    },
}


export const specialComponents = ['AppBar', 'Breadcrumbs', 'Footer'];