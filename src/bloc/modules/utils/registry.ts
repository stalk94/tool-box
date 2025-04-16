import React from 'react';

type ComponentDefinition = {
    type: string;
    component: React.FC<any>;
    defaultProps?: Record<string, any>;
    icon?: React.FC;
    category?: 'block' | 'interactive' | 'media' | 'complex' | 'misc';
    description?: string;
}


const internalComponentMap: Record<string, React.FC<any>> = {};
const defaultPropsMap: Record<string, Record<string, any>> = {};
const registry: Record<string, Omit<ComponentDefinition, 'component' | 'defaultProps'>> = {};

export function registerComponent(def: ComponentDefinition) {
    internalComponentMap[def.type] = def.component;
    defaultPropsMap[def.type] = def.defaultProps ?? {};
    
   
    registry[def.type] = {
        type: def.type,
        icon: def.icon,
        category: def.category,
        description: def.description ?? def.type,
    };
}

// Экспортируем доступ
export const componentRegistry = registry;
export const componentMap = internalComponentMap;
export const componentDefaults = defaultPropsMap;