import { hookstate } from "@hookstate/core";
import EventEmitter from "../../../app/emiter";
import { DataEmiters } from "../../type";

// shared storage 
export const sharedContext = hookstate({
    all: {}
});
export const sharedEmmiter = new EventEmitter();



// создание shared storage 
export const useCtxBufer = (id: number, initValue: any) => {
    const uid = `${id}`;

    // создаст storage в shared storage 
    sharedContext.set((prev)=> {
        if(prev[uid]) console.warn('Перезаписан bufer storage: ', uid);

        prev[uid] = initValue;
        return prev;
    });

    return (newValue: any)=> {
        sharedContext.set((prev)=> {
            prev[uid] = newValue;
            return prev;
        });
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