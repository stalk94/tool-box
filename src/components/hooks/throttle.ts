import { useMemo, useEffect } from 'react';
import { throttle } from 'lodash';


/**
 * Создаёт throttled-функцию с авто-очисткой при размонтировании компонента
 * @param callback Функция, которую нужно throttle-ить
 * @param delay Задержка в миллисекундах
 * @param deps Зависимости useMemo
 * @returns Безопасная throttled-функция
 */
export function useThrottled<T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 300,
    deps: React.DependencyList = []
): T {
    const throttled = useMemo(() => throttle(callback, delay), deps);

    useEffect(() => {
        return () => {
            throttled.cancel();
        };
    }, [throttled]);

    return throttled as T;
}