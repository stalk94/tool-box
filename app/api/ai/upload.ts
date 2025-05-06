import { createClient } from '@supabase/supabase-js';
import { applyPromptTemplate } from '@system/helpers/ai';


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const promptAi = `
Ты — ИИ, создающий блоки для визуального редактора сайтов. Каждый блок описывается строго в формате JSON, который может быть интерпретирован редактором. Ты не должен возвращать пояснений — только чистый JSON.

Ты получаешь изображение и текстовый запрос. На их основе генерируй UI-компоненты.

Формат:
[
  {
    "id": number,
    "parent": "{{id}}",
    "props": {
      "data-type": "...",
      // другие поля
    }
  },
  ...
]

Правила:
- Только валидный JSON-массив объектов
- Никаких children с вложенными компонентами
- Не использовать type, container, styles вне props
- Не добавлять пустые строки, объекты, null, undefined
- Каждый props содержит только значимые поля
- style — объект (fontSize: 18), не строка
- id — уникальное число (например, {{timestamp}} + индекс)
- parent — строка, совпадающая с {{id}}

Допустимые значения data-type и поддерживаемые поля:

- "Typography" — children, variant, align, style
- "Button" — label, variant, color, type, style, startIcon, endIcon
- "TextInput" — label, placeholder, value, fullWidth, type, style
- "Number" — label, placeholder, fullWidth, min, max, step, style
- "Date", "Time" — label, fullWidth, style
- "Select" — label, options, fullWidth, style
- "Checkbox", "Switch" — label, checked, style
- "Image" — src, alt, width, height, style
- "Video" — src, controls, autoplay, loop, muted, poster, style
- "div" — универсальный контейнер, только style и визуальные css

Переменные:
- {{id}} — id ячейки
- {{timestamp}} — текущее время


Сгенерируй только JSON массив объектов, каждый из которых соответствует одному компоненту редактора. Не используй пояснений, текста или нестандартизированных полей.
`


export async function uploadImageAndGenerateBlock(file: File, userPrompt: string): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;

    // 🔼 Загрузка в Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file);

    if (uploadError) {
        throw new Error('Ошибка загрузки в Supabase: ' + uploadError.message);
    }

    const resSpb = supabase.storage.from('images').getPublicUrl(fileName);

    // 🤖 Запрос в GPT-4 Vision
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4-turbo-2024-04-09',
            max_tokens: 2048,
            messages: [
                {
                    role: 'system',
                    content: applyPromptTemplate({id:'test'}, promptAi)
                },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: userPrompt },
                        { type: 'image_url', image_url: { url: resSpb.data.publicUrl } }
                    ]
                }
            ]
        })
    });

    const result = await res.json();

    if (!res.ok) {
        console.error('[OpenAI Error]', result);
        throw new Error('Ошибка от OpenAI');
    }

    return result.choices?.[0]?.message?.content?.trim() || '';
}
