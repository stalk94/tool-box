import type { SelectInputProps } from './type';
import { FormWrapper } from './atomize';
import DropMenu from '../list/drop-menu';
import { useCache, useClickOutside } from './hooks';
import { ChevronDownIcon } from '@heroicons/react/24/solid';


export default function Select({ 
    onChange, 
    placeholder, 
    items, 
    size, 
    value,
    required,
    ...props 
}: SelectInputProps) {
    const [input, setInput] = useCache(value);
    const [open, setOpen] = useCache(false);


    useClickOutside(['[data-select-root]', '[data-select-dropdown]'], 
        ()=> setOpen(false)
    );
    const handleSelect = (value: string) => {
        setInput(value);
        setOpen(false);
        onChange?.(value);
    }


    return (
        <FormWrapper
            size={size}
            popovertarget="popover-select" 
            data-select-root
            style={{ anchorName: "--anchor-select" }}
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
            <span
                onClick={()=> setOpen(v => !v)}
                className="w-full h-full flex items-center cursor-pointer"
            >
                { input 
                    ? input 
                    : <span className='text-neutral-500'>{placeholder}</span>
                }
            </span>

            { open && 
                <DropMenu
                    data-select-dropdown
                    id="popover-select" 
                    style={{ 
                        positionAnchor: "--anchor-select",
                    }}
                    items={items}
                    onSelect={handleSelect}
                /> 
            }
        </FormWrapper>
    );
}