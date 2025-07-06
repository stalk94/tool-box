import type { BaseProps } from './type';


export default function TextAreaInput({ onChange, placeholder, size, color, ...props }: BaseProps) {

    return (
        <textarea 
            onChange={(e)=> onChange?.(e.target.value)}
            placeholder={placeholder} 
            className={`
                textarea 
                textarea-${color}
                textarea-${size}
            `}
            { ...props }
        />
    );
}