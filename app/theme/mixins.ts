/**
 * стандартные паттерны стилевые паттерны  
 * -  надо добавить основные бордер радиусы  
 * -  стили разделителей
 */
export const mixins = {
    // пример
    responsivePadding: {
        padding: "10px",
        "@media (min-width:600px)": {
            padding: "20px",
        },
    },
    input: {
        fontStyle: "italic",
        variant: undefined,          //<undefined|"fullWidth"|"inset"|"middle"> 
        alight: undefined           // <'center'|undefined>
    },
    scrollbar: {
        "&::-webkit-scrollbar": {
            width: "3px",
            height: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#7e7e7e",
            borderRadius: '7px',
        },
        "&::-webkit-scrollbar-track": {
            background: "#2e2e2e",
        }
    }
}