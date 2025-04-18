import { hookstate, extend } from "@hookstate/core";
import { ComponentSerrialize, LayoutCustom } from './type';
import { localstored } from '@hookstate/localstored';


// копия на рендер App state
export const renderState = hookstate<LayoutCustom[]>([]);


export default hookstate(
    {
        mod: 'home',
        dragEnabled: true,                                          // отключить перетаскивание
        linkMode: <number|undefined> undefined,                     // режим связи
        layout: <LayoutCustom[]> <unknown>[],
        //tools: undefined,                                         // ?
        currentCell: <LayoutCustom> undefined,
    }, 
    localstored({ key: 'CONTEXT', engine: localStorage })
);


// сохраняемое состояние в localStorage редактора сетки (! это не дамп финальный)
export const cellsContent = hookstate<Record<string, ComponentSerrialize[]>>(
    {

    }, 
    localstored({key: 'cellsContent', engine: localStorage}
));


export const infoState = hookstate(new Proxy({
        container: {
            width: 0,
            height: 0
        },
        select: {
            /** это выбранный HTML layoout   */
            cell: <HTMLDivElement> undefined,
            /** это выбранный (react рендер) элемент  */
            content: <React.ReactElement> undefined,
            /** выделено в панели */
            panel: <{lastAddedType: string}> {
                lastAddedType: ''
            },
        },
        inspector: {
            lastData: {},
            task: []
        },
        contentAllRefs: <Record<string, Element>> undefined
    }, {
        set(target, property, value) {
            if(property === 'selectCell' && value) {
                // пример перехватчика
            }
            target[property] = value;
            return true;
        }
    }
))
