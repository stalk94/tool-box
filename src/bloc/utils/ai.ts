import { ComponentProps, InputStyles } from './../type';

type GenerateComponent = {
    [key: string] : any
    props: ComponentProps
}


/** форматирует данные после генерации ии, приводя к стандарту компонента */
export const formaterSchemeComponent = (component: GenerateComponent) => {
    const type = component.props['data-type'];
}


/**
 * Эксперементальная генерация блока из картинки и промпта (GPT vision). 
 * ! Только в контексте next.js       
 * prompt: 'Создай блок поле ввода и кнопка как на картинке'
 */
export const loadImageToAiGenerateComponentGpt = async (file: File, prompt: string) => {
    if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('prompt', prompt);

        const res = await fetch('/api/ai', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        return JSON.parse(data.json);
    }
}

export const fetchAi = async (prompt: string) => {
    
}