import { height } from '@mui/system';
import { hookstate, extend } from "@hookstate/core";
import { ComponentSerrialize, LayoutCustom } from './type';
import { localstored } from '@hookstate/localstored';
import select from '../input/select';


export default hookstate(
    {
        layout: <LayoutCustom[]> <unknown>[],
        tools: undefined,
        currentCell: <LayoutCustom> undefined,
    }, 
    localstored({ key: 'CONTEXT', engine: localStorage })
);




// сохраняемое состояние в localStorage (! это не дамп финальный)
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
            content: <React.ReactNode> undefined,
        } 
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
