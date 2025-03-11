import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../src/theme";
import { CssBaseline } from "@mui/material";


const globalTypes = {
  theme: {
    name: "Theme",
    description: "Выбор темы",
    defaultValue: "dark",
    toolbar: {
      icon: "paintbrush",
      items: ["light", "dark"],
      showName: true,
    },
  },
}

const decorators = [
  (Story, context) => {
    const theme = context.globals.theme === "dark" ? darkTheme : lightTheme;

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    );
  },
];

/** @type { import('@storybook/react').Preview } */
const preview = {
  globalTypes: globalTypes,
  decorators: decorators,
  parameters: {
    //actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    }
  },
};

export default preview;