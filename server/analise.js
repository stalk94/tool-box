const { default: chalk } = require("chalk");
const fs = require("fs");
const reactDocgen = require("react-docgen");


function analyzeComponent(filePath) {
    try {
        const componentCode = fs.readFileSync(filePath, "utf8");
        const parsedData = reactDocgen.parse(componentCode);
       
        parsedData.forEach((elem)=> {
            Object.entries(elem.props).forEach(([propName, propDetails]) => {
                console.log(`- ${propName}:`);
                //console.log(`  Description: ${propDetails.description}`);
                console.log(chalk.green(`  Type: ${propDetails.type?.name || "unknown"}`));
                console.log(`  Value: ${JSON.stringify(propDetails.type?.value) || "none"}`);
                console.log(`  Required: ${propDetails.required ? "Yes" : "No"}`);
              });
           
        });
        
        
        
    } catch (err) {
        console.error("Error analyzing the component:", err.message);
    }
}

  // Укажите путь к файлу компонента
const componentPath = "../node_modules/@mui/material/Button/Button.js";
analyzeComponent(componentPath);