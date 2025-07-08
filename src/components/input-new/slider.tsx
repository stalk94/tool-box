import type { SliderInputProps } from './type';
import * as Slider from '@radix-ui/react-slider';
import { FormWrapper } from './atomize';



export default function SliderInput({
    onChange,
    onChangeEnd,
    disableForm,
    size,
    color,
    value,
    min,
    max,
    step,
    config,
    ...props
}: SliderInputProps) {
    const isValid = value !== undefined && (typeof value === 'number' && !isNaN(value));
    const sizeThumb = {
        xs: 'w-4 h-2',
        sm: 'w-4 h-3',
        md: 'w-4 h-3',
        lg: 'w-6 h-4',
        xl: 'w-6 h-4',
        auto: 'w-4 h-3 sm:w-4 sm:h-3 md:w-4 md:h-3 lg:w-6 lg:h-4 xl:w-6 xl:h-4'
    }

    const useChange = (newValue: number[], clb?: (v: number | number[]) => void) => {
        if (!clb) return;

        if (Array.isArray(value)) clb(newValue);
        else clb(newValue[0]);
    }


    return (
        <FormWrapper
            style={disableForm && { background: 'inherit', border: 'none', boxShadow: 'none' }}
            size={size}
            {...props}
        >
            <Slider.Root
                defaultValue={isValid ? (Array.isArray(value) ? value : [value]) : [0]}
                onValueChange={(v) => useChange(v, onChange)}
                onValueCommit={(v) => useChange(v, onChangeEnd)}
                max={max ?? 100}
                min={min ?? 0}
                step={step ?? 1}
                className={`
                    flex
                    relative 
                    items-center 
                    select-none 
                    touch-none 
                    w-full
                    cursor-pointer
                `}
            >
                <Slider.Track 
                    data-editor-cfg='track'
                    style={{
                        background: config?.['track-color'] ?? 'darkgrey',
                        height: config?.['track-height'],
                    }}
                    className={`
                        relative 
                        grow 
                        rounded-full 
                        h-[3px]
                    `}
                >
                    <Slider.Range
                        data-editor-cfg='track-fill'
                        style={{
                            background: config?.['track-fill-color'] ?? 'lightgrey',
                            height: config?.['track-fill-height'],
                        }}
                        className={`
                            absolute
                            rounded-full 
                            h-full
                        `}
                    />
                </Slider.Track>

                <Slider.Thumb
                    data-editor-cfg='thumb'
                    style={{
                        background: config?.['thumb-color'],
                        height: config?.['thumb-height'],
                        width: config?.['thumb-width'],
                        '--thumb-hover-color': config?.['thumb:hover-color'] ?? 'white'
                    }}
                    className={`
                        block 
                        ${sizeThumb[size] ?? sizeThumb.auto}
                        bg-gray-200 
                        border 
                        border-gray-400 
                        rounded-full 
                        shadow 
                        hover:bg-[var(--thumb-hover-color)]
                        group
                    `}
                >
                    <span className="
                            absolute 
                            -top-6 left-1/2 -translate-x-1/2 
                            text-sm 
                            text-black 
                            bg-white 
                            px-1 py-0.5 
                            rounded shadow
                            opacity-0
                            group-data-[state=dragging]:opacity-100
                        "
                    >
                        { value[0] ?? 0 }
                    </span>
                </Slider.Thumb>
            </Slider.Root>
        </FormWrapper>
    );
}
