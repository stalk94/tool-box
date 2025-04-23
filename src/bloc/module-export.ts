import React from 'react';
import { componentMap } from './modules/utils/registry';
import { LayoutCustom, ComponentSerrialize, Component } from './type';
import './modules/index';               // окружение воссоздатся


// карта компонентов
export const COMPONENT_MAP = componentMap;


/** дессериализатор компонентов */
export const desserealize = (component: ComponentSerrialize) => {
    const { props, functions, parent } = component;
    const type = props["data-type"];

    const Component = componentMap[type];

    if(Component) {
        Component.displayName = type;
        Component.parent = parent;              // id контейнера в котором находится
        Component.functions = functions;        //! эксперементально
    }

    if (!Component) {
        console.warn(`Компонент типа "${type}" не найден в реестре`);
        return null;
    }

    return {
        Component: Component,
        props: props
    }
}

/** 
 * сделает заполнение ячеек `layout:` компонентами из карты `contents` (серриализованные данные компонентов)    
 * * на выходе готовая схема для `<Render>`    
 */
export const consolidation = (layout: LayoutCustom[], contents: Record<number, ComponentSerrialize[]>) => {
    return layout.map((layer) => {
        const cache = contents;
        const curCacheLayout: ComponentSerrialize[] = cache[layer.i];

        if (curCacheLayout) {
            const resultsLayer: Component[] = [];

            Object.values(curCacheLayout).map((content) => {
                const result = desserealize(content);

                if (result) resultsLayer.push(
                    React.createElement(result.Component, result.props)
                );
            });

            layer.content = resultsLayer;
        }

        return layer;
    });
}
