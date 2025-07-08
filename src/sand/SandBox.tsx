import React, { useImperativeHandle } from 'react';
import { BaseInput, NumberInput, SelectInput, TextAreaInput, CheckBoxInput, SliderInput, FileInput, AutoComplete } from 'src/components/input-new';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import SwitchBox from 'src/components/input-new/switch';
import RadioBox from 'src/components/input-new/radio';
import ColorPicker from 'src/components/input-new/color';
import { __generate } from 'src/components/generate-tw';

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

document.addEventListener('click', (e) => {
    const el = e.target as HTMLElement;
    if (!el.dataset) return;

    const hasEditorData = Object.keys(el.dataset).some((key) =>
        key.startsWith('editor')
    );

    if (hasEditorData) {
        for (const [key, value] of Object.entries(el.dataset)) {
            if (key.startsWith('editor')) {
                const match = key.match(/^([a-z]+)([A-Z].*)$/);
                const [, prefix, suffix] = match;
                console.log(`${suffix.toLowerCase()}: ${value}`);


            }
        }
    }
});



export default function SandBox({ setMode }) {
    const [theme, setTheme] = React.useState('dark');
    const on = false;
    const [s, setS] = React.useState(0);
    const [c, setC] = React.useState('blue');

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
                <div className="flex flex-col m-auto w-90">
                <ColorPicker
                    size='sm'
                    labelLeft='rgba'
                    placeholder='placeholder'
                    value={c}
                    onChange={setC}
                />
                <BaseInput
                    type='text'
                    placeholder='placeholder'
                    labelTop={<div>xro</div>}
                    required
                    minLength='4' 
                />
                <AutoComplete
                    labelLeft={<div>test</div>}
                    items={['test', 'xro']}
                    size='sm'
                />
                <BaseInput
                    size='sm'
                    labelLeft='test'
                    type='time'
                    placeholder='placeholder'
                    validator={true}
                />
                <BaseInput
                    size='sm'
                    labelLeft='test'
                    type='date'
                    placeholder='placeholder'
                />
                <FileInput
                    size='sm'
                    labelTop={<div>xro</div>}
                    onChange={console.log}
                />
                <NumberInput
                    size='sm'
                    placeholder='placeholder'
                    onChange={setS}
                    iconEnable={true}
                    value={s}
                />
                <SelectInput  
                    size='sm'
                    items={['test', 'test2']}
                    labelLeft='test'
                    placeholder='placeholder'
                />
                <TextAreaInput
                    placeholder='placeholder'
                />
                <SwitchBox
                    labelLeft='test'
                   
                />
                <RadioBox
                    labelLeft='test'
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
            {on &&
                <div className="hidden">
                    badge badge-primary badge-secondary badge-accent badge-info badge-success badge-warning badge-error badge-neutral
                    badge-outline badge-xs badge-sm badge-md badge-lg

                    alert alert-info alert-success alert-warning alert-error
                    avatar avatar-group mask mask-squircle mask-circle mask-hexagon mask-triangle mask-parallelogram mask-decagon mask-heart

                    card card-bordered card-compact card-normal bg-primary bg-secondary bg-accent bg-neutral bg-base-100 bg-base-200 bg-base-300

                    text-primary text-secondary text-accent text-info text-success text-warning text-error text-neutral
                    bg-primary bg-secondary bg-accent bg-info bg-success bg-warning bg-error bg-neutral

                    progress progress-primary progress-secondary progress-accent progress-info progress-success progress-warning progress-error

                    loading loading-spinner loading-dots loading-ring loading-ball loading-bars loading-infinity loading-lg loading-md loading-sm loading-xs
                    tab tab-bordered tab-active tabs-boxed tabs-lifted tabs-bordered
                    table table-zebra table-pin-rows table-pin-cols

                    dropdown dropdown-left dropdown-right dropdown-top dropdown-bottom
                    menu menu-horizontal menu-vertical
                    modal modal-open drawer drawer-open toast toast-start toast-end toast-top toast-bottom

                    tooltip tooltip-top tooltip-bottom tooltip-left tooltip-right
                    collapse collapse-open collapse-close collapse-arrow
                    navbar navbar-start navbar-center navbar-end
                    flex grid hidden block inline-block inline-flex

                    btn btn-primary btn-secondary btn-accent btn-error btn-success btn-warning btn-info btn-neutral
                    btn-outline btn-dash btn-soft btn-ghost btn-link
                    btn-xs btn-sm btn-md btn-lg btn-xl
                    sm:btn-xs sm:btn-sm sm:btn-md sm:btn-lg sm:btn-xl
                    md:btn-xs md:btn-sm md:btn-md md:btn-lg md:btn-xl
                    lg:btn-xs lg:btn-sm lg:btn-md lg:btn-lg lg:btn-xl
                    xl:btn-xs xl:btn-sm xl:btn-md xl:btn-lg xl:btn-xl

                    input input-bordered input-primary input-secondary input-accent input-info input-success input-warning input-error
                    input-xs input-sm input-md input-lg input-xl
                    sm:input-xs sm:input-sm sm:input-md sm:input-lg sm:input-xl
                    md:input-xs md:input-sm md:input-md md:input-lg md:input-xl
                    lg:input-xs lg:input-sm lg:input-md lg:input-lg lg:input-xl
                    xl:input-xs xl:input-sm xl:input-md xl:input-lg xl:input-xl

                    select select-bordered select-primary select-secondary select-accent select-info select-success select-warning select-error
                    select-xs select-sm select-md select-lg select-xl
                    sm:select-xs sm:select-sm sm:select-md sm:select-lg sm:select-xl
                    md:select-xs md:select-sm md:select-md md:select-lg md:select-xl
                    lg:select-xs lg:select-sm lg:select-md lg:select-lg lg:select-xl
                    xl:select-xs xl:select-sm xl:select-md xl:select-lg xl:select-xl

                    textarea textarea-bordered textarea-primary textarea-secondary textarea-accent textarea-info textarea-success textarea-warning textarea-error
                    textarea-xs textarea-sm textarea-md textarea-lg textarea-xl
                    sm:textarea-xs sm:textarea-sm sm:textarea-md sm:textarea-lg sm:textarea-xl
                    md:textarea-xs md:textarea-sm md:textarea-md md:textarea-lg md:textarea-xl
                    lg:textarea-xs lg:textarea-sm lg:textarea-md lg:textarea-lg lg:textarea-xl
                    xl:textarea-xs xl:textarea-sm xl:textarea-md xl:textarea-lg xl:textarea-xl

                    badge badge-primary badge-secondary badge-accent badge-info badge-success badge-warning badge-error badge-neutral
                    badge-outline badge-xs badge-sm badge-md badge-lg badge-xl
                    sm:badge-xs sm:badge-sm sm:badge-md sm:badge-lg sm:badge-xl
                    md:badge-xs md:badge-sm md:badge-md md:badge-lg md:badge-xl
                    lg:badge-xs lg:badge-sm lg:badge-md lg:badge-lg lg:badge-xl
                    xl:badge-xs xl:badge-sm xl:badge-md xl:badge-lg xl:badge-xl

                    text-primary text-secondary text-accent text-info text-success text-warning text-error text-neutral
                    bg-primary bg-secondary bg-accent bg-info bg-success bg-warning bg-error bg-neutral

                    text-xs text-sm text-base text-lg text-xl text-2xl text-3xl
                    sm:text-xs sm:text-sm sm:text-base sm:text-lg sm:text-xl sm:text-2xl sm:text-3xl
                    md:text-xs md:text-sm md:text-base md:text-lg md:text-xl md:text-2xl md:text-3xl
                    lg:text-xs lg:text-sm lg:text-base lg:text-lg lg:text-xl lg:text-2xl lg:text-3xl
                    xl:text-xs xl:text-sm xl:text-base xl:text-lg xl:text-xl xl:text-2xl xl:text-3xl

                    checkbox checkbox-primary checkbox-secondary checkbox-accent checkbox-info checkbox-success checkbox-warning checkbox-error
                    checkbox-xs checkbox-sm checkbox-md checkbox-lg checkbox-xl
                    sm:checkbox-xs sm:checkbox-sm sm:checkbox-md sm:checkbox-lg sm:checkbox-xl
                    md:checkbox-xs md:checkbox-sm md:checkbox-md md:checkbox-lg md:checkbox-xl
                    lg:checkbox-xs lg:checkbox-sm lg:checkbox-md lg:checkbox-lg lg:checkbox-xl
                    xl:checkbox-xs xl:checkbox-sm xl:checkbox-md xl:checkbox-lg xl:checkbox-xl


                    toggle toggle-primary toggle-secondary toggle-accent toggle-info toggle-success toggle-warning toggle-error
                    toggle-xs toggle-sm toggle-md toggle-lg toggle-xl
                    sm:toggle-xs sm:toggle-sm sm:toggle-md sm:toggle-lg sm:toggle-xl
                    md:toggle-xs md:toggle-sm md:toggle-md md:toggle-lg md:toggle-xl
                    lg:toggle-xs lg:toggle-sm lg:toggle-md lg:toggle-lg lg:toggle-xl
                    xl:toggle-xs xl:toggle-sm xl:toggle-md xl:toggle-lg xl:toggle-xl


                    radio radio-primary radio-secondary radio-accent radio-info radio-success radio-warning radio-error
                    radio-xs radio-sm radio-md radio-lg radio-xl
                    sm:radio-xs sm:radio-sm sm:radio-md sm:radio-lg sm:radio-xl
                    md:radio-xs md:radio-sm md:radio-md md:radio-lg md:radio-xl
                    lg:radio-xs lg:radio-sm lg:radio-md lg:radio-lg lg:radio-xl
                    xl:radio-xs xl:radio-sm xl:radio-md xl:radio-lg xl:radio-xl
                </div>
            }
        </div>
    );
}