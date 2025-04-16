import { Events } from "./global.js";


class EventEmitter {
    events: Record<keyof Events, Events[keyof Events][]> = {} as Record<keyof Events, Events[keyof Events][]>;

    on<K extends keyof Events>(eventName: K, fn: Events[K]) {
        if (!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(fn);

        return ()=> {
            this.events[eventName] = this.events[eventName].filter((eventFn)=> fn !== eventFn);
        };
    }
    emit<K extends keyof Events>(eventName: K, data: Parameters<Events[K]>[0]) {
        const event = this.events[eventName];
        if(event) {
            event.forEach((fn) => {
                fn.call(null, data);
            });
        }
    }
    off<K extends keyof Events>(eventName: K, fn?: Events[K]) {
        if(fn) {
            let index = this.events[eventName].findIndex((func)=> {
                if(func === fn) return true;
                else if(func.toString() === fn.toString()) return true;
            });
            if(index !== -1) this.events[eventName].splice(index, 1);
        } 
        else {
            delete this.events[eventName];
        }
    }
}


export default class ExtendedEmitter extends EventEmitter {
    private _globalListeners: ((eventName: keyof Events, payload: any) => void)[] = [];

    onAny(fn: (eventName: keyof Events, payload: any) => void): () => void {
        this._globalListeners.push(fn);
        return () => {
            this._globalListeners = this._globalListeners.filter(listener => listener !== fn);
        };
    }
    override emit<K extends keyof Events>(eventName: K, data: Parameters<Events[K]>[0]): void {
        // Вызов оригинального emit
        super.emit(eventName, data);

        // Добавочный вызов глобальных слушателей
        for (const listener of this._globalListeners) {
            try {
                listener(eventName, data);
            } 
            catch (e) {
                console.warn(`[ExtendedEmitter] Ошибка в глобальном слушателе:`, e);
            }
        }
    }
    clearGlobals() {
        this._globalListeners = [];
    }
}