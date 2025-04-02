import colorCustom from './color.json';


export const darkPallete = {

    palette: {
        mode: "dark",
        input: {
            main: 'rgba(255, 255, 255, 0.05)',
            mainBorder: 'rgba(255, 255, 255, 0.2)',
            error: '#f34f4fcc',
            success: 'rgba(120, 227, 114, 0.6)',
            placeholder: '#808080',
            ...colorCustom.input
        },
        chekbox: {
            main: 'rgba(255, 255, 255, 0.05)',
            border: 'rgba(255, 255, 255, 0.3)',
            success: 'rgba(255, 255, 255, 0.6)',
            ...colorCustom.chekbox
        },
        switch: {
            trackOn: 'rgba(255, 255, 255, 0.25)',
            trackOff: 'rgba(255, 255, 255, 0.05)',
            thumb: 'rgb(215, 215, 215)',
            border: 'rgba(255, 255, 255, 0.6)',
            icon: 'rgb(215, 215, 215)',
            ...colorCustom.switch
        },
        table: {
            body: "#5151513f",
            header: "#5c5c5c62",
            thead: "#353943",
            ...colorCustom.table
        },
        appBar: {
            main: "rgba(57, 62, 70, 0.35)",
            ...colorCustom.appBar
        },
        card: {
            main: "rgba(255, 255, 255, 0.05)",
            border: 'rgba(255, 255, 255, 0.15)',
            ...colorCustom.card
        },
        menu: {
            main: "rgba(63, 63, 63, 0.5)",
            select: "rgba(255, 255, 255, 0.1)"
        },
        background: {
            default: '#222222',                     // базовый цвет фона '#2c303d'
            sidenav: "#1f283e",                     //? что это
            paper: "rgb(63, 63, 63)",    
        },
        // app bar цвет navigation link
        navigation: {
            main: "rgba(255, 255, 255, 0.8)",
        },
        // что это
        text: {
            disabled: 'gray'
        },
    },
    
}