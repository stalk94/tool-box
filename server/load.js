const fs = require("fs");
const icons = require("@mui/icons-material");

const iconNames = Object.keys(icons).filter(
  (name) => name !== "default" && name !== "SvgIcon" && name !== "createSvgIcon"
);

const imports = iconNames
  .map((name) => `import ${name} from "@mui/icons-material/${name}";`)
  .join("\n");

const exportList = iconNames.map((name) => `  ${name},`).join("\n");

const output = `
${imports}

export const Icons = {
${exportList}
};
`;

fs.writeFileSync("./icons.js", output);  