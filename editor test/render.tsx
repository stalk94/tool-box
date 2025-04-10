import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { height } from "@mui/system";


const componentsMap = {
    Box,
    TypographyComponent: Typography,
    ButtonComponent: Button,
}
const componentsMapStr = {
    Box: 'Box',
    TypographyComponent: 'Typography',
    ButtonComponent: 'Button',
}


/**
 * Рендерит JSON-структуру, возвращённую из craftToSimpleJson
 * @param node JSON-узел
 * @param componentsMap Словарь доступных компонентов, по имени
 * @returns React-элемент
 */
export function renderJsonToReact(node, componentsMap) {
    if (!node || typeof node !== "object") return null;
  
    const { component, props = {}, children = [] } = node;
    const Component = componentsMap[component] || component;
  
    // Забираем children из props, если есть (текст и пр.)
    const contentFromProps = props.children;
    const childElements = Array.isArray(children)
      ? children.map((child, i) => renderJsonToReact(child, componentsMap))
      : [];
  
    // Объединяем контент: сначала из props.children, потом обычные children
    const finalChildren = [
        ...(typeof contentFromProps === "string" ? [contentFromProps] : []),
        ...childElements,
    ];
  
    const { children: _, ...rest } = props;
  
    return React.createElement(Component, { key: component + Math.random(), ...rest }, ...finalChildren);
}
function transformNode(id, nodes) {
    const node = nodes[id];
    if (!node) return null;

    const component =
        node.type?.resolvedName || node.displayName || node.type || "div";

    const props = { ...node.props };

    const children = node.nodes
        ?.map((childId) => transformNode(childId, nodes))
        .filter(Boolean);

    return {
        component,
        props,
        ...(children?.length ? { children } : {})
    };
}
export function craftToSimpleJson(craftJson) {
    try {
        const parsed = typeof craftJson === "string" ? JSON.parse(craftJson) : craftJson;

        if (!parsed.ROOT) {
            throw new Error("ROOT не найден");
        }

        return transformNode("ROOT", parsed);
    } 
    catch (e) {
        console.error("Ошибка разбора Craft JSON:", e);
        return null;
    }
}


/**
 * Преобразует JSON-структуру в исходный JSX код как строку
 * @param node JSON-узел
 * @param componentsMap Словарь доступных компонентов, по имени
 * @returns JSX код в виде строки
 */
function jsonToJSXString(node, componentsMap) {
    if (!node || typeof node !== 'object') return '';

    const { component, props = {}, children = [] } = node;
    const Component = componentsMap[component] || component;

    // Преобразуем свойства в строку
    const propsString = Object.entries(props).map(([key, value]) => {
            // Проверка на строки, числа, булевы значения и массивы, object
            if(key !== 'children') {
                if (typeof value === 'string') {
                    return `${key}="${value}"`;
                } 
                else if (typeof value === 'boolean') {
                    return `key: ${value ? 'true' : 'false'}`;
                } 
                else if (Array.isArray(value)) {
                    return `${key}={[${value.join(', ')}]}`;
                }
                else if(typeof value === 'object') {
                    return `${key}={${JSON.stringify(value)}}`;
                }
                return '';
            }
        })
        .join(' ');
        
    
    // Преобразуем детей в строку
    const contentFromProps = props.children;
    const childElements = Array.isArray(children)
        ? children.map((child) => jsonToJSXString(child, componentsMap))
        : [];

    // Если contentFromProps это строка, добавляем её, иначе берем детей
    const finalChildren = [
        ...(typeof contentFromProps === 'string' ? [contentFromProps] : []),
        ...childElements,
    ];

    // Если есть дети, формируем JSX строку с ними
    return `<${Component} ${propsString}>${finalChildren.join('')}</${Component}>`;
}


export default function PageFromJson({ json, toCode }) {

    if(toCode) return(
        <div>
            <pre>
                { jsonToJSXString(json, componentsMapStr) }
            </pre>
        </div>
    );
    else return (
        <>
            { renderJsonToReact(json, componentsMap) }
        </>
    );
}