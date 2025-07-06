import React from 'react';

export function useClientValidity<T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    ref: React.RefObject<T>
) {
    const [invalid, setInvalid] = React.useState(false);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onInvalid = (e: Event) => {
            //e.preventDefault(); // подавляем нативный тултип
            setInvalid(true);
        }
        const onInput = () => {
            setInvalid(!el.validity.valid);
        }

        el.addEventListener('invalid', onInvalid);
        el.addEventListener('input', onInput);

        // инициализация на клиенте
        setInvalid(!el.validity.valid);

        return () => {
            el.removeEventListener('invalid', onInvalid);
            el.removeEventListener('input', onInput);
        };
    }, [ref]);

    
    return invalid;
}