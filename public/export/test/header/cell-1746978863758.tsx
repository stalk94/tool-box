import { NumberInput } from '@lib/index';
import React from 'react';

export default function Cell() {
    return (
        <>
            <div style={{ width: '100%', display: 'block' }}>
                <NumberInput
                    left={undefined}
                    style={{ fontSize: 14 }}
                    onChange={v => console.log(v)}
                    styles={{}}
                    label="label"
                    position="column"
                    placeholder="ввод number"
                    data-type="Number"
                />
            </div>
        </>
    );
}
