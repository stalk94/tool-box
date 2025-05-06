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