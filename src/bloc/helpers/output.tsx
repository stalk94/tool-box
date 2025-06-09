import { renderComponentSsrPrerender } from "@bloc/modules/export/utils";
import { editorContext, infoSlice, renderSlice, cellsSlice, nestedContextSlice } from "../context";
import { desserealize } from "./sanitize";
import { componentMap } from '../modules/helpers/registry';
import { ComponentSerrialize, LayoutsBreackpoints  } from "@bloc/type";



export function statikRender(code: string, component: ComponentSerrialize) {
    console.log(component)
}

export const consolidationRender = (content: Record<string, ComponentSerrialize[]>, layouts: LayoutsBreackpoints) => {
    const breackpoint = editorContext.size.breackpoint.get();

    // 🎯 Собираем renderSlice
    const result = layouts[breackpoint].map((layer) => {
        const cellContent = content[layer.i] ?? [];

        const children = cellContent
            .map((componentData) => {
                const Element = componentMap[componentData.props['data-type']];

                if (!Element) return null;
                else return componentData;
            })
            .filter(Boolean);

        return {
            ...layer,
            content: children,
        }
    });

    return result;
}