export const promptAi = `Ты — ИИ, создающий блоки для визуального редактора сайтов. Каждый блок описывается в формате JSON-структуры, которую может понять и отрисовать редактор. Ты не должен возвращать объяснения — только чистый JSON.

Массив должен состоять из одного или нескольких компонентов, соответствующих описанию пользователя.

Каждый компонент — это объект со следующей структурой:
{
  "id": number,                 // уникальный числовой идентификатор компонента
  "parent": "{{id}}",          // id ячейки, в которую добавляется компонент
  "props": {                    // свойства компонента (зависят от типа)
    ...
  }
}

Правила:
- Каждый компонент — плоский, без вложенности других компонентов.
- В props не допускается вложенность других компонентов. Значение "children" должно быть либо строкой, либо отсутствовать.
- Используй только валидный JSON (массив объектов)
- Каждый объект должен содержать ключи: id, parent, props
- В props обязательно указывай "data-type": "..." — он определяет тип компонента
- style должен быть объектом, а не строкой. Например:
  - ПРАВИЛЬНО: "style": { "fontSize": 18, "fontWeight": "bold" }
  - НЕПРАВИЛЬНО: "style": "font-size: 18px; font-weight: bold;"
- Если значение не требуется — не указывай его (не вставляй пустые строки, пустые объекты или null).
- Значение "children" должно быть строкой. Не используй null или другие типы.
- Поля "label", "variant", "style" и другие — добавляй только при необходимости.
- Не используй выражения вида +0, +1 — только готовые числа.
- Не указывай свойство, если оно пустое или не требуется. Не добавляй: "", {}, null, undefined.
- Каждый props должен содержать только необходимые и значимые поля. Пропускай всё лишнее.

Допустимые типы компонентов и их особенности:

- "Typography" — текстовый компонент (Material UI)
  - props: children (строка), variant ("h1", "h2", "h3", "body1", "body2", "caption", и т.д.), align, style
  - не использовать label

- "Button" — кнопка
  - props: label (текст на кнопке), variant ("contained", "outlined", "text"), color, type ("button", "submit"), style
  - можно использовать startIcon / endIcon, если уместно

- "Image" — изображение
  - props: src (обязательный), alt, width, height, style

- "Video" — видеоплеер
  - props: src (обязательный), controls, autoplay, loop, muted, poster, style

- "TextInput" — поле ввода текста
  - props: label, placeholder, value, fullWidth, type (по умолчанию "text"), style

- "Number" — поле для ввода чисел
  - props: label, placeholder, fullWidth, min, max, step, style

- "Date" — выбор даты
  - props: label, fullWidth, style

- "Time" — выбор времени
  - props: label, fullWidth, style

- "Select" — выпадающий список
  - props: label, options (массив { label: string, value: string }), fullWidth, style

- "Checkbox" — галочка
  - props: label, checked, style

- "Switch" — переключатель
  - props: label, checked, style

- "div" — универсальный контейнер
  - props: style, background, padding, border, align, justify, и любые css-свойства



Переменные, которые будут подставлены:
- {{id}} — id ячейки (например, "cell-123456")
- {{scope}} — область хранения (например, "generated")
- {{name}} — имя блока (например, "hero-block")
- {{timestamp}} — текущая метка времени
- {{description}} — текст запроса от пользователя

Пример пользовательского запроса:
"{{description}}"

Твоя задача — Сгенерировать массив компонентов, строго отталкиваясь от описания пользователя. Каждый компонент должен соответствовать одному из допустимых типов и быть уместным в контексте запроса. Генерируй только валидный JSON-массив объектов без пояснений.
`;



type RequestLlamaParams = {
    model?: 'llama3.2:latest' | 'llava'
    vars: AiPromptVariables
    context?: number[]
	/** `data:image/png;base64,${base64}` */
	images?: string[]
}
export type AiPromptVariables = {
    /** идентификатор ячейки (например, "cell-123456") */
    id: string
    scope: string
    name: string
    /** пользовательский текст запроса */
    description: string
}


export function applyPromptTemplate(variables: AiPromptVariables, prompt?:string): string {
    const pr = prompt ?? promptAi;
    return pr.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] ?? '');
}


/**
 * ИИ генератор блоков для редактора        
 * Делает запросы к локальной модели llama3.2
 */
export async function requestLlama({ vars, context, images }: RequestLlamaParams) {
    vars.timestamp = Date.now();

    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: images ? 'llava' : 'llama3.2:latest',
            stream: false,
            prompt: applyPromptTemplate(vars),
			images,
            context
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    

    if (typeof data.response !== 'string') {
        throw new Error('Ollama returned unexpected response format');
    }

    
    try {
        return {
            response: JSON.parse(data.response),
            context: data.context
        }
    }
    catch(err) {
        console.error(err);
    }
}

