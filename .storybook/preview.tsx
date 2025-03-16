import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme, lightTheme } from "../src/theme";
import { CssBaseline } from "@mui/material";
import { withConsole } from '@storybook/addon-console';
import type { Preview } from "@storybook/react";

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
    (Story, context) => {
      const theme = context.globals.theme === "dark" ? darkTheme : lightTheme;

      return withConsole()(() => (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      ))(context);
    }
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