import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../src/theme";
import { CssBaseline } from "@mui/material";
import { withConsole } from '@storybook/addon-console';
import type { Preview } from "@storybook/react";

// Кастомные цвета логов
const customConsole = {
  log: (...args: unknown[]) => console.log("🟢 LOG:", ...args),
  warn: (...args: unknown[]) => console.warn("🟠 WARN:", ...args),
  error: (...args: unknown[]) => console.error("🔴 ERROR:", ...args),
  info: (...args: unknown[]) => console.info("🔵 INFO:", ...args),
};


// Декоратор с кастомным логированием
const withCustomConsole = (Story, context) => 
  withConsole({
    log: customConsole.log,
    warn: customConsole.warn,
    error: customConsole.error,
    info: customConsole.info,
})(Story)(context);


const preview: Preview = {
  globalTypes: {
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
  },
  decorators: [
    withCustomConsole,
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? darkTheme : lightTheme;
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;