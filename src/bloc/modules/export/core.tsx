// core.ts — утилита для экспорта Tabs с вложенными слотами как сетками
import { exportLiteralToFile } from "../../utils/export";
import exportsGrid, { mergeImports, splitImportsAndBody, getComponentLiteral } from './Grid';
import { LayoutCustom, Component } from '../../type';


// 🔧 экспорт одной ячейки как slot-N
async function exportSlotLayoutAsLiteral(
    slot: LayoutCustom[],
    index: number,
    scope: string,
    name: string
): Promise<{ importLine: string; jsx: string }> {
    const slotName = `slot-${index}`;

    // 🔁 используем тот же exportsGrid, но с isSlot
    await exportsGrid(slot, scope, `${name}/Tabs/${slotName}`, true);

    return {
        importLine: `import Slot${index} from './Tabs/${slotName}';`,
        jsx: `Slot${index}()`
    };
}


// 🧩 экспорт Tabs с вложенными слотами (каждый слот — LayoutCustom[])
export async function exportedTabs(
    items: string[],
    textColor: 'inherit' | 'secondary' | 'primary' | undefined,
    slots: LayoutCustom[][],
    scope: string,
    name: string
) {
    const tabLabels = items.map((label, i) => `
        <Tab key={${i}} label="${label}" />
    `).join('\n');

    const slotEntries: string[] = [];
    const importLines: string[] = [];

    await Promise.all(
        slots.map(async (layout, index) => {
            const result = await exportSlotLayoutAsLiteral(layout, index, scope, name);
            importLines.push(result.importLine);
            slotEntries.push(`\"${index}\": ${result.jsx}`);
        })
    );

    const literal = `
        import React from 'react';
        import { Tabs, Tab } from '@mui/material';
        ${importLines.join('\n')}

        export default function TabNavigation() {
            const [curent, setCurent] = React.useState(0);
            const slots = {
                ${slotEntries.join(',\n')}
            };

            return (
                <div style={{ width: '100%', display: 'block' }}>
                    <Tabs
                        value={curent}
                        onChange={(event: React.SyntheticEvent, newValue: number) => setCurent(newValue)}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        textColor="${textColor}"
                        aria-label="tabs"
                    >
                        ${tabLabels}
                    </Tabs>
                    <div style={{ height: 'fit-content' }}>
                        { slots[curent] }
                    </div>
                </div>
            );
        }
    `;

    await exportLiteralToFile([scope, name], 'index', literal);
}


const test = async () => {
    await exportedTabs(
        ['Tab 1', 'Tab 2'],
        'primary',
        [
            [
                {
                    i: 'cell-1',
                    content: [
                        {
                            id: 1,
                            parent: 'cell-1',
                            props: {
                                'data-id': 1,
                                'data-type': 'Button',
                                children: 'Click me',
                                variant: 'contained'
                            }
                        }
                    ],
                    x: 0, y: 0, w: 6, h: 2
                }
            ],
            [
                {
                    i: 'cell-2',
                    content: [
                        {
                            id: 2,
                            parent: 'cell-2',
                            props: {
                                'data-id': 2,
                                'data-type': 'Typography',
                                children: 'Second tab content',
                                variant: 'h6'
                            }
                        }
                    ],
                    x: 0, y: 0, w: 6, h: 2
                }
            ]
        ],
        'output',
        'TabsWithSlots'
    );
}