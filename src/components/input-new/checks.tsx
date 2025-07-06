import type { CheckBoxInputProps } from './type';


export default function CheckBoxInput({ 
    onChange, 
    size, 
    color, 
    value, 
    labelLeft, 
    labelRight, 
    type, 
    ...props 
}: CheckBoxInputProps) {
    
    return (
        <label className='label'>
            { labelLeft &&
                <span className="label">
                    { labelLeft }
                </span>
            }
            <input 
                type='checkbox'
                onChange={(e)=> onChange?.(e.target.checked)}
                checked={value} 
                className={`
                    ${type}
                    ${type}-${color}
                    ${type}-${size}
                `}
                { ...props }
            />
            { labelRight &&
                <span className="label">
                    { labelLeft }
                </span>
            }
        </label>
    );
}