import { Events } from "./global.js";

class EventEmitter<T extends Record<string, (...args: any[]) => void>> {
    events: Record<keyof T, T[keyof T][]> = {} as Record<keyof T, T[keyof T][]>;

    on<K extends keyof T>(eventName: K, fn: T[K]) {
        if (!this.events[eventName]) this.events[eventName] = [];
        this.events[eventName].push(fn);
        return () => {
            this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
        };
    }

    emit<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>) {
        const handlers = this.events[eventName];
        if (handlers) {
            handlers.forEach((fn) => fn(...args));
        }
    }

    off<K extends keyof T>(eventName: K, fn?: T[K]) {
        if (fn) {
            const index = this.events[eventName].findIndex((f) => f === fn || f.toString() === fn.toString());
            if (index !== -1) this.events[eventName].splice(index, 1);
        } else {
            delete this.events[eventName];
        }
    }
}

export default class ExtendedEmitter<T extends Record<string, (...args: any[]) => void>> extends EventEmitter<T> {
    private _globalListeners: ((eventName: keyof T, payload: Parameters<T[keyof T]>[0]) => void)[] = [];

    onAny(fn: (eventName: keyof T, payload: Parameters<T[keyof T]>[0]) => void): () => void {
        if (!this._globalListeners.includes(fn)) {
            this._globalListeners.push(fn);
        } else {
            console.warn('Повторная подписка');
        }

        return () => {
            this._globalListeners = this._globalListeners.filter(listener => listener !== fn);
        };
    }

    override emit<K extends keyof T>(eventName: K, ...args: Parameters<T[K]>): void {
        super.emit(eventName, ...args);

        for (const listener of this._globalListeners) {
            try {
                listener(eventName, args[0]); // по умолчанию передаётся первый аргумент
            } catch (e) {
                console.warn(`[ExtendedEmitter] Ошибка в глобальном слушателе:`, e);
            }
        }
    }

    clearGlobals() {
        this._globalListeners = [];
    }
}