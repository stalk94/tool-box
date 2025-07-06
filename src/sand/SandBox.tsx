import React, { useImperativeHandle } from 'react';
import { BaseInput, NumberInput, SelectInput, TextAreaInput, CheckBoxInput, SliderInput, FileInput } from 'src/components/input-new';
import { Form, Schema, AccordionForm, AccordionScnema } from '../index';


const daisyThemes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave",
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua",
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk",
  "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim",
  "nord", "sunset"
];
function getRealComponentName(node: React.ReactElement): string {
    const type = node.type;

    if (typeof type === 'string') return type; // например: 'div'

    const resolved =
        type?.type?.render ||  // memo(forwardRef)
        type?.render ||        // forwardRef
        type?.type ||          // memo
        type;

    let name =
        resolved?.name || // настоящее имя функции/класса
        resolved?.constructor?.name;

    if (!name) return 'Unknown';

    // Обрезаем всё, что после имени, если есть цифры или скобки
    name = name.replace(/[0-9]+$/, '');          // убирает цифры на конце
    name = name.replace(/^.*\(/, '').replace(/\).*$/, ''); // убирает обёртки вроде ForwardRef(...)

    return name;
}

function RenderWithTracking({ children }) {
    const handleClick = () => {
        const name = getRealComponentName(children);
        console.log('click: ', name);
    }
    const parse = () => {
        window.electronAPI.typeParse('./src/sand/SandBox.tsx', getRealComponentName(children))
            .then();
    }

    return (
        <div className="contents"
            onClick={handleClick}
        >
            { children }
        </div>
    );
}


export default function SandBox({ setMode }) {
    const [theme, setTheme] = React.useState('dark');
    const [s, setS] = React.useState(0);

    return(
        <div 
            data-theme={theme} 
            className="flex h-screen w-screen" 
            style={{width:'100%'}}
        >
            <aside className="w-64 text-white flex flex-col p-4"
                style={{background: 'rgb(58, 58, 58)',boxShadow: "4px 0 5px rgba(0, 0, 0, 0.1)"}}
            >
                <nav className="flex flex-col gap-2">
                    <SelectInput
                        size='xs'
                        value={theme}
                        items={daisyThemes}
                        onChange={setTheme}
                    />
                </nav>
            </aside>


            <main className="flex flex-col h-screen w-full">
                <div className="flex flex-col m-auto">
                <BaseInput
                    color='primary'
                    
                    type='text'
                    placeholder='placeholder'
                    labelTop='test'
                    validator='xro'
                    minLength='4'
                />
                <BaseInput
                    color='primary'
                    labelLeft='test'
                    type='time'
                    placeholder='placeholder'
                    validator={true}
                />
                <BaseInput
                    color='primary'
                    labelLeft='test'
                    type='date'
                    placeholder='placeholder'
                />
                <FileInput
                    onChange={console.log}
                />
                <NumberInput
                    placeholder='placeholder'
                    onChange={setS}
                    iconEnable={true}
                    value={s}
                />
                <SelectInput
                    items={['test', 'test2']}
                />
                <TextAreaInput
                    placeholder='placeholder'
                />
                <CheckBoxInput
                    labelLeft='test'
                    type='toggle'
                />
                <CheckBoxInput
                    labelLeft='test'
                    type='radio'
                />
                <CheckBoxInput
                    labelLeft='test'
                    type='checkbox'
                />
                <SliderInput
                    labelLeft='test'
                    labelTop='xro'
                    value={3}
                />
                </div>
            </main>
        </div>
    );
}