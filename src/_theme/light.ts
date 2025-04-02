export const lightPallete = {

    palette: {
        mode: "light",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1",
        },
        text: {
            disabled: 'gray'
        },
        // ! надо изменить структуру. Сейчас это текст color placeholder
        placeholder: {
            main: '#f48fb1'   
        },
        // app bar цвет navigation link
        navigation: {
            main: "rgba(255, 255, 255, 0.8)",
        },
        table: {
            body: "#5151513f",
            header: "#5c5c5c62",
            thead: "#353943"
        },
        background: {
            default: "#f0f2f5",
            sidenav: "#1f283e",
            card: "#202940",
            paper: "#747b8a",
            input: "#393E46",                       // цвет фона всех инпутов, селектов
            navBar: "#86898d61",                    // ? переделать влияет на карточку
            appBar: "#747b8a",
            menu: "#747b8a"
            
        },
        // это управляет цветами обводок инпутов
        action: {
            active: 'rgba(255, 255, 255, 0.25)'  
        }
    },
    
}