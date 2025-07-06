import React from 'react';

type LabelProps = {
    'data-id'?: string | number
    required?: boolean
    children: any
    labelLeft?: string | React.ReactElement
    labelRight?: string | React.ReactElement
    labelTop?: string | React.ReactElement
    color?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    validator?: string | React.ReactElement | boolean
    style?: React.CSSProperties
}
type LabelTopProps = {
    'data-id'?: string | number
    required?: boolean
    children: any
    color?: string
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}


export const LabelTop = ({ children, color, size, required, 'data-id': dataId }: LabelTopProps) => {
    return(
        <label 
            className={`
                flex
            `}
        >
            { children }
            { required &&
                <div className='ml-1 text-red-600'>
                    *
                </div>
            }
        </label>
    );
}
export const Label = ({ 
    children, 
    labelLeft, 
    labelRight, 
    labelTop, 
    color, 
    size,
    validator, 
    required,
    style,
    'data-id': dataId
}: LabelProps) => {
    return(
        <React.Fragment>
            { labelTop &&
                <LabelTop required={required}>
                    { labelTop }
                </LabelTop>
            }
            <label 
                style={style}
                className={`
                    input 
                    input-${color}
                    input-${size}
                    ${validator && 'validator'}
                `}
            >
                { labelLeft &&
                    <span className="label">
                        { labelLeft }
                    </span>
                }

                { children }

                { labelRight &&
                    <span className="label">
                        { labelRight }
                        { required && !labelTop &&
                            <div className='ml-1 text-red-600'>
                                *
                            </div>
                        }
                    </span>
                }
            </label>
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