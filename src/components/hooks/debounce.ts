import { useMemo, useEffect } from 'react';
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
    delay: number = 300,
    deps: React.DependencyList = []
): T {
    const debounced = useMemo(() => debounce(callback, delay), deps);

    useEffect(() => {
        return () => {
            debounced.cancel();
        };
    }, [debounced]);

    return debounced as T;
}