import { BorderInfo, SpacingInfo, BoxSide } from './type';


/**
 * oпределяет есть ли видимый border у style элемента
 */
export const useHasVisibleBorder = (style: CSSStyleDeclaration) => {
    const hasVisibleBorder = ['Top', 'Right', 'Bottom', 'Left'].some(side => {
        const width = style[`border${side}Width` as keyof CSSStyleDeclaration];
        const styleVal = style[`border${side}Style` as keyof CSSStyleDeclaration];
        const color = style[`border${side}Color` as keyof CSSStyleDeclaration];

        return width !== '0px' && styleVal !== 'none' && color !== 'transparent';
    });

    return hasVisibleBorder;
}

/**
 * Возвращаем массив бордеров элемента
 */
export const getElementBorderStyle = (style: CSSStyleDeclaration): BorderInfo[] => {
    const borders = ['Top', 'Right', 'Bottom', 'Left'].map(side => {
        const sideLower = side.toLowerCase()
        const width = style.getPropertyValue(`border-${sideLower}-width`)
        const borderStyle = style.getPropertyValue(`border-${sideLower}-style`)
        const color = style.getPropertyValue(`border-${sideLower}-color`)
    
        return {
            side: sideLower,
            width,
            style: borderStyle,
            color,
            isVisible: width !== '0px' && borderStyle !== 'none' && color !== 'transparent'
        }
    })
  
    // Возвращаем только видимые
    return borders;
}

/**
 * Вернет два массива один с padding другой margins элемента
 */
export const getElementBoxStyle = (style: CSSStyleDeclaration) => {
    const sides: BoxSide[] = ['top', 'right', 'bottom', 'left'];
  
    const paddings: SpacingInfo[] = sides.map(side => {
        const value = style.getPropertyValue(`padding-${side}`);

        return {
            side,
            value,
            isSet: value !== '0px'
        }
    });
  
    const margins: SpacingInfo[] = sides.map(side => {
        const value = style.getPropertyValue(`margin-${side}`);

        return {
            side,
            value,
            isSet: value !== '0px'
        }
    });
  
    return {
        paddings,
        margins
    }
}


export function parseCss(cssText) {
    const regex = /([#\w-]+)\s*\{\s*([^}]+)\s*\}/g; // Регулярное выражение для селекторов и их стилей
    const result = {};

    let match;
    while ((match = regex.exec(cssText)) !== null) {
        const selector = match[1];  // Селектор (например, #test, #two)
        const stylesText = match[2]; // Стили (например, color: 'red')

        const styles = stylesText
            .split(';')  // Разделяем по точке с запятой
            .map(style => style.trim())  // Убираем лишние пробелы
            .filter(style => style)  // Отфильтровываем пустые строки
            .reduce((acc, style) => {
                const [property, value] = style.split(':').map(str => str.trim());
                acc[property] = value;  // Записываем в объект
                return acc;
            }, {});

        result[selector.replace('#', '')] = styles; // Убираем # из селектора
    }

    return result;
}

export function objectToCss(styles) {
    let cssText = '';

    for (const selector in styles) {
        if (styles.hasOwnProperty(selector)) {
            const properties = styles[selector];
            let styleString = '';

            for (const property in properties) {
                if (properties.hasOwnProperty(property)) {
                    styleString += `${property}: ${properties[property]}; `;
                }
            }

            cssText += `#${selector} { ${styleString.trim()} }\n`;
        }
    }

    return cssText;
}