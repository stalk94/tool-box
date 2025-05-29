import { useRef, useEffect } from 'react';


/**
 * Создаёт debounced-функцию с авто-очисткой при размонтировании компонента
 * @param callback Функция, которую нужно debounce-ить
 * @param delay Задержка в миллисекундах
 * @param deps Зависимости useMemo
 * @returns Безопасная debounced-функция
 */
export function useDebounced<T extends (...args: any[]) => void>(
    callback: T,
    delay: number,
    deps: any[] = []
): T {
    const timeoutRef = useRef<NodeJS.Timeout>(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return ((...args: any[]) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            savedCallback.current(...args);
        }, delay);
    }) as T;
}


export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 100): T {
    let timer: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    } as T;
}