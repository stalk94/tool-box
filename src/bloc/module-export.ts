import React from 'react';
import { componentMap } from './modules/utils/registry';
import { LayoutCustom, ComponentSerrialize, Component } from './type';
import './modules/index';               // окружение воссоздатся


// карта компонентов
export const COMPONENT_MAP = componentMap;


// дессериализатор
export const desserealize = (component: ComponentSerrialize) => {
    const { props, functions, parent } = component;
    const type = props["data-type"];

    const Component = componentMap[type];
    Component.displayName = type;
    Component.parent = parent;              // id контейнера в котором находится
    Component.functions = functions;        //! эксперементально


    if (!Component) {
        console.warn(`Компонент типа "${type}" не найден в реестре`);
        return null;
    }

    return {
        Component: Component,
        props: props
    }
}

/** сделает заполнение ячеек `list` компонентами из карты `listComponent` (серриализованные данные компонентов) */
export const consolidation = (list: LayoutCustom[], listComponent: Record<number, ComponentSerrialize[]>) => {
    return list.map((layer) => {
        const cache = listComponent;
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