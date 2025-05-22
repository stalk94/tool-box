import { DateInput, TextInput, ToggleInput } from '@lib/index';
import { SliderInput } from '@lib';
import {} from '@mui/icons-material';
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
                <SliderInput
                    start={undefined}
                    end={undefined}
                    labelSx={{
                        fontSize: 14
                    }}
                    onChange={v => console.log(v)}
                    label="label"
                    position="column"
                    data-type="Slider"
                />
            </div>

            <div
                style={{
                    width: '100%',
                    display: 'block'
                }}
            >
                <ToggleInput
                    left={undefined}
                    labelSx={{
                        fontSize: 14
                    }}
                    onChange={v => console.log(v)}
                    styles={{}}
                    label="label"
                    position="column"
                    items={[
                        {
                            id: '1',
                            label: 'test-1'
                        },
                        {
                            id: '2',
                            label: 'test-2'
                        }
                    ]}
                    data-type="ToggleButtons"
                />
            </div>
        </>
    );
}
