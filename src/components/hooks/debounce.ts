import { useRef, useEffect } from 'react';
import { debounce } from 'lodash';


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