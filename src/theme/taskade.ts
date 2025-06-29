import { PaletteOptions } from "@mui/material/styles";

export const palleteStd = {
    input: {
        main: '#2C3035',
        border: 'rgba(255, 255, 255, 0.2)',
        placeholder: '#808080',
        label: '#808080'
    },
    chekbox: {
        main: 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.3)',
        success: 'rgba(255, 255, 255, 0.6)',
    },
    switch: {
        trackOn: 'rgba(255, 255, 255, 0.25)',
        trackOff: 'rgba(255, 255, 255, 0.05)',
        thumb: 'rgb(215, 215, 215)',
        border: 'rgba(255, 255, 255, 0.6)',
        icon: 'rgb(215, 215, 215)',
    },
    slider: {
        thumb: 'rgb(255, 255, 255)',            // Цвет "пальца" ползунка
        track: 'lightgrey',                       // Цвет пути ползунка
        rail: 'darkgrey'                          // Цвет "рельсы" (основной фон)
    },

    // верхняя навигационная панель
    appBar: {
        main: "rgba(57, 62, 70, 0.3)",
        border: 'rgba(255, 255, 255, 0.1)'
    },
    // левая панелька (как в vscode)
    toolNavBar: {
        main: 'rgb(58, 58, 58)',
        icon: 'rgba(255, 255, 255, 0.3)',
        select: 'rgba(255, 255, 255, 0.7)',
        badgeBcg: undefined,
        badgeText: 'rgba(255, 255, 255, 0.7)'
    },
    accordion: {
        headerMain: 'rgba(255, 255, 255, 0.05)',
        headerContent: 'rgba(255, 255, 255, 0.6)',
        headerIcon: undefined
    },
    table: {
        body: "#5151513f",
        header: "#5c5c5c62",
        thead: "#353943",
    },

    card: {
        main: "rgba(255, 255, 255, 0.05)",
        border: 'rgba(255, 255, 255, 0.15)',
    },
    // установка цвета Menu, Popper, Dialog
    menu: {
        main: "#17191C",
        select: "rgba(255, 255, 255, 0.1)",
    },
    background: {
        default: '#1C1F22',                     
        sidenav: "#1f283e",                     
        paper: "#17191C",   
    },
    // цвет навигационных кнопок (app bar)
    navigation: {
        main: "rgba(255, 255, 255, 0.8)"
    },

    // кнопки
    primary: {
        main: '#D12954',
        contrastText: '#fff',
    },
    secondary: {
        main: '#dc004e',
        contrastText: '#fff',
    },
}


const transform =()=> {
    const result = {};

    Object.keys(palleteStd).map((key)=> {
        result[key] = {
            ...palleteStd[key],
            ...colorCustom[key]
        }
    });

    return result;
}

export const taskadePallete: { palette: PaletteOptions } = {
    palette: {
        mode: "dark",
        ...palleteStd
    }
}