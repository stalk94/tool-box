import React from 'react';
import { listAllComponents } from '../modules/RENDER';       //обёртки компонентов
import { componentRegistry } from '../config/registry-component';  // регистр



export const createComponentFromRegistry = (
    type: string,
    propsOverrides: Record<string, any> = {}
): React.ReactElement | null => {
    /////////////////////////////////////////////////////////////////
    const conf = componentRegistry[type];
    if (!conf) {
        console.warn(`[Registry] Компонент "${type}" не найден в componentRegistry.`);
        return null;
    }

    const ComponentWrapper = listAllComponents[type];
    if (!ComponentWrapper) {
        console.warn(`[Render] Нет визуального обёрточного компонента для типа "${type}"`);
        return null;
    }

    const id = Date.now(); // можно заменить на uuid
    const props = {
        ...conf.defaultProps,
        ...propsOverrides,
        'data-id': id,
        'data-type': type
    }


    return (
        <ComponentWrapper
            key={id}
            {...props}
        />
    );
}