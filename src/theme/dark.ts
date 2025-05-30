export const palleteStd = {
    input: {
        main: 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.2)',
        error: '#f34f4fcc',
        success: 'rgba(120, 227, 114, 0.6)',
        placeholder: '#808080',
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
        main: "rgba(57, 62, 70, 0.35)",
        border: 'rgba(255, 255, 255, 0.3)'
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
        main: "#313131",
        select: "rgba(255, 255, 255, 0.1)",
    },
    background: {
        default: '#222222',                     // базовый цвет фона '#2c303d'
        sidenav: "#1f283e",                     //? что это
        paper: "rgba(7, 7, 7, 0.05)",   // с какого цвета начинается
    },
    // app bar цвет navigation link
    navigation: {
        main: "rgba(255, 255, 255, 0.8)"
    },
    // что это
    text: {
        disabled: 'gray'
    },
}



export const darkPallete = {
    palette: {
        mode: "dark",
        ...palleteStd
    }
}