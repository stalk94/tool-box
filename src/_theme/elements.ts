/*
    глобальные стили для элементов
    ! это наверное не совсем правильное решение
*/


export const elements = {
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