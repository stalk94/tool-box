import React from 'react';
import type { AutoInputProps } from './type';
import { LabelTop, FormWrapper } from './atomize';
import DropMenu from '../list/drop-menu';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useCache, useClickOutside } from './hooks';


export default function Autocomplete({ 
    onChange, 
    placeholder, 
    items, 
    size, 
    value,
    required,
    ...props 
}: AutoInputProps) {
    const [input, setInput] = useCache(value ?? '');
    const [open, setOpen] = useCache(false);


    useClickOutside(['[data-autocomplete-root]', '[data-autocomplete-dropdown]'], 
        ()=> setOpen(false)
    );
    const filtered = items.filter(opt =>
        opt.toLowerCase().includes(input.toLowerCase())
    );
    const handleSelect = (value: string) => {
        setInput(value);
        setOpen(false);
        onChange?.(value);
    }


    return (
        <FormWrapper
            size={size}
            popovertarget="popover-1" 
            data-autocomplete-root
            style={{ anchorName: "--anchor-1" }}
            labelRight={ 
                <ChevronDownIcon
                    onClick={()=> setOpen(v => !v)}
                    className={`
                        label w-[1em] h-[1em]
                        cursor-pointer
                        fill-current
                        ${open && 'rotate-180'}
                    `}
                />
            }
            { ...props }
        >
            <input
                type="text"
                placeholder={placeholder}
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    setOpen(true);
                }}
            />

            { open && filtered.length > 0 && 
                <DropMenu
                    data-autocomplete-dropdown
                    id="popover-1" 
                    style={{ 
                        positionAnchor: "--anchor-1",
                    }}
                    items={filtered ?? []}
                    onSelect={handleSelect}
                /> 
            }
        </FormWrapper>
    );
}