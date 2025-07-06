import React from 'react';
import { Label, ValidatorBottomLabel } from './atomize';
import { useClientValidity } from './hooks';
import type { BaseProps } from './type';


export default function BaseInput({ 
    style, 
    type, 
    placeholder, 
    size, 
    color, 
    labelLeft, 
    labelTop, 
    labelRight, 
    validator, 
    onChange, 
    required,
    ...props 
}: BaseProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const isInvalid = useClientValidity(inputRef);


    return(
        <fieldset className={labelTop && 'fieldset'}>
            <Label 
                labelLeft={labelLeft}
                labelRight={labelRight}
                labelTop={labelTop}
                size={size}
                color={color}
                validator={validator}
                required={required}
                data-id={props['data-id']}
                style={style}
            >
                <input
                    ref={inputRef}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    style={{display: 'block'}}
                    onChange={(e)=> onChange?.(e.target.value)}
                    { ...props }
                />
                { validator && typeof validator === 'boolean' && isInvalid &&
                    <ValidatorBottomLabel data-id={props['data-id']}>
                        !
                    </ValidatorBottomLabel>
                }
            </Label>
            { validator && isInvalid &&
                (typeof validator === 'object' || typeof validator === 'string') && 
                    <ValidatorBottomLabel data-id={props['data-id']}>
                        { validator }
                    </ValidatorBottomLabel>
            }
        </fieldset>
    );
}