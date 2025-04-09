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
    
}