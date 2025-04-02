const fs = require("fs");
const path = require("path");
const { default: chalk } = require("chalk");
const reactDocgen = require("react-docgen");
const stripAnsi = require("strip-ansi");

function analyzeComponent(filePath) {
    try {
      const componentCode = fs.readFileSync(filePath, 'utf8');
      const parsedData = reactDocgen.parse(componentCode);
  
      // Собираем данные в удобную таблицу
      let report = 'Component: ' + filePath.split('/').pop() + '\n';
      report += '--------------------------------------------------\n';
      report += '| Prop Name     | Type          | Required | Possible Values            |\n';
      report += '|---------------|---------------|----------|----------------------------|\n';
  
      parsedData.forEach((elem) => {
        Object.entries(elem.props).forEach(([propName, propDetails]) => {
          const propType = propDetails.type.name; // Тип пропса
          let possibleValues = '-';
  
          // Обрабатываем union типы и выводим возможные значения
          if (propDetails.type.name === 'union') {
            possibleValues = propDetails.type.value
              .map((val) => val.name)
              .join(' | ');
          }
  
          // Если тип просто строка или число, выводим его
          if (propType === 'string' || propType === 'number' || propType === 'bool') {
            possibleValues = propType;
          }
  
          // Формируем строку для таблицы
          report += `| ${propName.padEnd(15)}| ${propType.padEnd(15)}| ${propDetails.required ? 'Yes' : 'No'} | ${possibleValues.padEnd(25)}|\n`;
        });
      });
  
      // Записываем отчет в файл
      fs.writeFileSync('props-report.txt', report);
      console.log('Report generated successfully!');
    } catch (err) {
      console.error('Error analyzing the component:', err.message);
    }
  }
  
// Укажите путь к компоненту
const componentPath = path.join(__dirname, "../node_modules/@mui/material/CardHeader/CardHeader.js");
analyzeComponent(componentPath);