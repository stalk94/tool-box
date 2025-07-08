import React from 'react';

type LabelProps = {
    'data-id'?: string | number
    /** отключить видимость формы */
    disabledVisibility?: boolean
    popovertarget?: string
    required?: boolean
    children: any
    labelLeft?: string | React.ReactElement
    labelRight?: string | React.ReactElement
    labelTop?: string | React.ReactElement
    colorBorder?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    validator?: string | React.ReactElement | boolean
    style?: React.CSSProperties & { anchorName?: string }
}
type LabelTopProps = {
    'data-id'?: string | number
    required?: boolean
    children: any
    color?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}


export const LabelTop = ({ children, color, size, required, 'data-id': dataId }: LabelTopProps) => {
    const getSize = size ? `input-${size}` : 'input-sm sm:input-md md:input-md lg:input-lg xl:input-lg';

    return(
        <label
            className={`
                flex
                ${getSize}
            `}
        >
            <span className='brightness-50'>
                { children }
            </span>
            { required &&
                <div className='ml-1 text-red-600'>
                    *
                </div>
            }
        </label>
    );
}
export const FormWrapper = ({ 
    children, 
    labelLeft, 
    labelRight, 
    labelTop, 
    colorBorder, 
    size,
    validator, 
    required,
    style,
    disabledVisibility,
    ...props
}: LabelProps) => {
    //todo: вынести в настройки проекта
    const getSize = size ? `input-${size}` : 'input-sm sm:input-md md:input-md lg:input-lg xl:input-lg';
    

    return(
        <React.Fragment>
            { labelTop &&
                <LabelTop size={size} required={required}>
                    { labelTop }
                </LabelTop>
            }
            <div 
                style={style}
                className={disabledVisibility ? `${getSize}` : `
                    input
                    w-full
                    input-${colorBorder}
                    ${getSize}
                    ${validator && 'validator'}
                `}
                { ...props }
            >
                { labelLeft &&
                    <span 
                        className={`
                            label
                            ${disabledVisibility && 'mr-4'}
                        `}
                    >
                        { labelLeft }
                    </span>
                }

                { children }

                { labelRight &&
                    <span 
                        //style={{border: labelLeft && 'none'}}
                        className={`
                            label
                            ${disabledVisibility && 'ml-4'}
                        `}
                    >
                        { labelRight }
                        { required && !labelTop &&
                            <div className='ml-1 text-red-600'>
                                *
                            </div>
                        }
                    </span>
                }
            </div>
        </React.Fragment>
    );
}


export const ValidatorBottomLabel =({ children, 'data-id': dataId })=> {
    return(
        <span
            style={{
                marginTop: 0
            }} 
            className="validator-hint"
        >
            { children }
        </span>
    )
}