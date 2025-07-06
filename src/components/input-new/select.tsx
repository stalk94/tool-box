import type { SelectInputProps } from './type';


export default function SelectInput({ 
    onChange, 
    placeholder, 
    labelLeft, 
    labelTop,
    items, 
    size, 
    color, 
    ...props 
}: SelectInputProps) {

    return (
        <label 
            className={`
                select 
                select-${size}
                select-${color}
            `}
        >
            {labelLeft &&
                <span className="label">
                    { labelLeft }
                </span>
            }
            <select
                onChange={(e)=> onChange?.(e.target.value)}
                { ...props }
            >
                {placeholder && 
                    <option disabled selected>
                        { placeholder }
                    </option>
                }
                {items?.map((child, index)=> 
                    <option 
                        className='bg-base-300' 
                        key={index}
                    >
                        { child }
                    </option>
                )}
            </select>
        </label>
    );
}