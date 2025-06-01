import { DateInput, NumberInput, TextInput } from '@lib/index';
import React from 'react';

export default function Cell() {
    return (
        <>
            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <TextInput
                    left={undefined}
                    labelSx={{
                        fontSize: 14
                    }}
                    onChange={v => console.log(v)}
                    styles={{}}
                    label="label"
                    position="column"
                    placeholder="ввод"
                    divider="none"
                    data-type="TextInput"
                />
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <NumberInput
                    left={undefined}
                    labelSx={{
                        fontSize: 14
                    }}
                    onChange={v => console.log(v)}
                    styles={{}}
                    label="label"
                    position="column"
                    placeholder="ввод number"
                    data-type="Number"
                />
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <DateInput
                    left={undefined}
                    labelSx={{
                        fontSize: 14
                    }}
                    onChange={v => console.log(v)}
                    styles={{}}
                    label="label"
                    position="column"
                    type="time"
                    styles={{}}
                    data-type="Time"
                />
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <DateInput
                    left={undefined}
                    labelSx={{
                        fontSize: 14
                    }}
                    onChange={v => console.log(v)}
                    styles={{}}
                    label="label"
                    position="column"
                    type="date"
                    styles={{}}
                    data-type="Date"
                />
            </div>
        </>
    );
}
