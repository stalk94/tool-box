import type { SliderInputProps } from './type';
import * as Slider from '@radix-ui/react-slider';
import type { LabelsSliderProps } from './type';


const Wrap = ({ children, labelLeft, labelRight, labelTop }: LabelsSliderProps) => {
    return(
        <>
            
            <label className='label'>
                { labelLeft &&
                    <span className="label">
                        { labelLeft }
                    </span>
                }
                { children }
                { labelRight &&
                    <span className="label">
                        { labelRight }
                    </span>
                }
            </label>
        </>
    );
}

//! стилизация
export default function SliderInput({ 
    onChange, 
    onChangeEnd,
    size, 
    color, 
    value, 
    min,
    max, 
    step,
    ...props 
}: SliderInputProps) {
    const isValid = value !== undefined && (typeof value === 'number' && !isNaN(value));

    const useChange = (newValue: number[], clb?: (v: number|number[])=> void) => {
        if (!clb) return;

        if (Array.isArray(value)) clb(newValue);
        else clb(newValue[0]);
    }


    return (
        <Wrap {...props}>
            <Slider.Root
                defaultValue={isValid ? (Array.isArray(value) ? value : [value]) : [0]}
                onValueChange={(v)=> useChange(v, onChange)}
                onValueCommit={(v)=> useChange(v, onChangeEnd)}
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
                `}
            >
                <Slider.Track 
                    style={{
                        background: 'darkgrey'
                    }}
                    className={`
                        relative 
                        grow 
                        rounded-full 
                        h-[3px]
                    `}
                >
                    <Slider.Range 
                        style={{
                            background: 'lightgrey'
                        }}
                        className={`
                            absolute
                            rounded-full 
                            h-full
                        `}
                    />
                </Slider.Track>

                <Slider.Thumb 
                    className={`
                        block 
                        w-6 h-4
                        bg-white 
                        border 
                        border-gray-400 
                        rounded-full 
                        shadow 
                        hover:bg-red-400
                    `}
                />
            </Slider.Root>
        </Wrap>
    );
}