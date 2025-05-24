import { infoSlice } from "../../context";
import EventEmitter from "../../../app/emiter";
import { createState, useLocalStorage } from 'statekit-react';

export const sharedContext = createState('sharedContext', {});
export const sharedEmmiter = new EventEmitter();



// создание shared storage 
export const useCtxBufer = (id: number, initValue: any) => {
    const uid = `${id}`;
    const ref = document.querySelector(`[data-id='${uid}']`);

    // создаст storage в shared storage 

    
    return (newValue: any)=> {
    
    }
}
//  компонент создает эммитер
export const useEvent = (id: string | number) => {
    const uid = `${id}`;

    // label - это как класификатор уточнение
    return (label: DataEmiters, data: any)=> {
        sharedEmmiter.emit(uid, { label, data });
    }
}