import { renderComponentSsrPrerender } from "@bloc/modules/export/utils";
import { editorContext, infoSlice, renderSlice, cellsSlice, nestedContextSlice } from "../context";
import { desserealize } from "./sanitize";
import { ComponentSerrialize } from "@bloc/type";



export function statikRender(code: string, component: ComponentSerrialize) {
    console.log(component)
}