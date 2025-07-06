import type { FileInputProps } from './type';



export default function FileInput({ onChange, size, color, ...props }: FileInputProps) {
    return (
        <div className='contents'>
            <input 
                type="file"
                onChange={(e)=> onChange?.(e.target.files)}
                className={`
                    file-input
                    file-input-${color}
                    file-input-${size}
                    file:border-transparent
                    file:border-1
                    file:px-2
                    file:rounded-md
                `}
                { ...props }
            />
        </div>
    );
}