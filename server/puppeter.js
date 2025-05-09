import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';



export async function renderWithPuppeteer(componentPath, props={}) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Минимальный HTML-шаблон
    await page.setContent(`<html><body><div id="root"></div></body></html>`, {
        waitUntil: 'domcontentloaded',
    });

    // Подключаем React и ReactDOM
    await page.addScriptTag({ url: 'https://unpkg.com/react@18/umd/react.production.min.js' });
    await page.addScriptTag({ url: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js' });

    // Читаем исходник компонента как строку
    const absPath = path.resolve(componentPath);
    const raw = await fs.readFile(absPath, 'utf8');
    

    // Упрощённый способ загрузки кода компонента
    await page.addScriptTag({
        content: `
            ${raw}
            const Component = exports?.default ?? module?.exports?.default;
            const props = ${JSON.stringify(props)};
            const root = document.getElementById('root');
            ReactDOM.render(React.createElement(Component, props), root);
        `,
    });

    // Ждём выполнения эффектов
    await page.waitForFunction(() => true, { timeout: 1000 });

    // Забираем финальный HTML
    const html = await page.$eval('#root', el => el.innerHTML);
    console.log(html)

    await browser.close();
    return html;
}