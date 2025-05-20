import { iconsList } from '../../components/tools/icons';
import { ViewModule, TouchApp, Photo, Layers, Widgets } from '@mui/icons-material';
import { Paper } from '@mui/material';
import { LuBlocks } from "react-icons/lu";
import { MdOutlineWidgets } from "react-icons/md";


// список категорий компонентов
export const componentGroups = {
    block: {
        label: 'Базовые блоки',
        icon: ViewModule,
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
    misc: {
        label: 'Прочее',
        icon: Widgets,
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