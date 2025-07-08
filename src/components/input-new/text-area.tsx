import React from 'react';
import type { BaseProps } from './type';
import { LabelTop } from './atomize';

type TextAreaProps = Omit<BaseProps, 'type'>;


export default function TextAreaInput({ onChange, placeholder, size, color, labelTop, required, ...props }: TextAreaProps) {
    const sizes = size ? `textarea-${size}` : `textarea-sm sm:textarea-md md:textarea-md lg:textarea-lg xl:textarea-lg`;

    return (
        <React.Fragment>
            { labelTop &&
                <LabelTop size={size} required={required}>
                    { labelTop }
                </LabelTop>
            }

            <textarea
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className={`
                    textarea 
                    w-full
                    textarea-${color}
                    ${sizes}
                `}
                {...props}
            />
        </React.Fragment>
    );
}