import { Fragment } from 'react';
import type { SelectInputProps } from './type';
import { FormWrapper } from './atomize';
import { RgbaColorPicker, RgbaColor } from 'react-colorful';
import { rgbaToString, stringToRgba } from '../hooks/helpers';
import { useCache, useClickOutside } from './hooks';
import { useDebounced } from '../hooks/debounce';
import styles from './styles/global.module.css';


const Inputs = ({ updateComponent, input }) => {
    const rgba = stringToRgba(input);

    return(
        <div className="flex gap-1 items-center w-full h-full">
            {(['r', 'g', 'b'] as const).map((ch) => (
                <Fragment key={ch}>
                    <span className='text-neutral-500'>
                        {ch + ':'}
                    </span>
                    <input
                        type="number"
                        min={0}
                        max={255}
                        value={rgba[ch]}
                        onChange={(e) => updateComponent(ch, Math.max(0, Math.min(255, +e.target.value)), rgba)}
                        placeholder={ch.toUpperCase()}
                        className="max-w-8"
                    />
                </Fragment>
            ))}

            <span className='text-neutral-500'>
                a:
            </span>
            <input
                type="number"
                step={0.01}
                min={0}
                max={1}
                value={rgba.a}
                onChange={(e) => updateComponent('a', Math.max(0, Math.min(1, +e.target.value)), rgba)}
                placeholder="A"
                className="max-w-8"
            />
        </div>
    );
}

// ! доработать размеры color preview
export default function SelectColor({ 
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


    const debouncedOnChange = useDebounced((val: string) => {
        onChange?.(val);
    }, 100, [onChange]);
    useClickOutside(['[data-color-root]', '[data-color-dropdown]'], 
        ()=> setOpen(false)
    );
    const handleChangePicker = (value: RgbaColor) => {
        const str = rgbaToString(value);
        setInput(str);
        debouncedOnChange(str);
    }
    const handleChangeInputs = (key: keyof RgbaColor, val: number, rgba: RgbaColor) => {
        const updated = { ...rgba, [key]: val };
        const str = rgbaToString(updated);
        setInput(str);
        debouncedOnChange(str);
    }
    

    return (
        <FormWrapper
            size={size}
            data-color-root
            popovertarget="popover-color" 
            style={{ anchorName: "--anchor-color" }}
            labelRight={ 
                <span onClick={()=> setOpen(true)}
                    className={`
                        min-w-4
                        min-h-4
                        cursor-pointer
                        bg-neutral-600
                        rounded-[2px]
                    `}
                    style={{ background: input }}
                />
            }
            { ...props }
        >
            <Inputs
                input={input}
                updateComponent={handleChangeInputs}
            />

            { open && 
                <div
                    id="popover-color" 
                    style={{ positionAnchor: "--anchor-color" }}
                    className={`
                        dropdown 
                        shadow-md
                        backdrop-blur-[3px]
                        max-h-80 
                        overflow-y-auto 
                        z-[9999]
                        p-2
                        rounded-box
                    `}
                    data-color-dropdown
                >
                    <div className={styles.wrapper} style={{ padding: 9 }}>
                        <RgbaColorPicker
                            style={{width:'100%'}}
                            className="colorPicker"
                            color={stringToRgba(input)}
                            onChange={handleChangePicker}
                        /> 
                    </div>
                </div>
            }
        </FormWrapper>
    );
}