import { iconsList } from '../../components/tools/icons';
import { ViewModule, TouchApp, Photo, Layers, Widgets, Launch } from '@mui/icons-material';
import { Paper } from '@mui/material';
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