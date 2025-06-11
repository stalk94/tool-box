import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';


async function screenshotElementFromHTML() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Пример HTML (можно загрузить файл, или собрать динамически)
  const html = `
    <html>
      <head>
        <style>
          body { margin: 0; font-family: sans-serif; }
          .capture {
            width: 300px;
            height: 200px;
            background: linear-gradient(to right, #00f, #0ff);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          }
        </style>
      </head>
      <body>
        <div class="capture">🎯 Hello, Screenshot!</div>
      </body>
    </html>
  `;

  // Загружаем HTML
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // Ждём, пока рендер завершится (если нужно — можно добавить паузу или waitForSelector)
  await page.waitForSelector('.capture');

  const element = await page.$('.capture');
  if (!element) throw new Error('Элемент не найден');

  // Скриншот конкретного DOM-элемента
  await element.screenshot({ path: 'capture.png' });

  console.log('Скриншот сохранён в capture.png');

  await browser.close();
}