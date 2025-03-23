import type { StorybookConfig } from "@storybook/react-vite";


const config: StorybookConfig = {
	stories: [
		'../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		'../src/**/*.mdx', 
	],
	addons: [
		'@storybook/addon-viewport',
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@chromatic-com/storybook",
		"@storybook/experimental-addon-test",
		'@storybook/addon-styling',
		'@storybook/addon-measure',
		'@storybook/addon-console',
		'@storybook/addon-docs',
		"@storybook/addon-controls"
	],
	framework: {
		"name": "@storybook/react-vite",
		"options": {
			builder: {
				viteConfigPath: 'vite.config.js',
			}
		}
	},
	typescript: {
		check: true,
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			tsconfigPath: '../tsconfig.json',
			include: ['../src/**/*.{js,jsx,ts,tsx}'],
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
		},
	},
	docs: {
		autodocs: 'tag',
	}
};
export default config;



/**
 * typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      // Speeds up Storybook build time
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      // Makes union prop types like variant and size appear as select controls
      shouldExtractLiteralValuesFromEnum: true,
      // Makes string and boolean types that can be undefined appear as inputs and switches
      shouldRemoveUndefinedFromOptional: true,
      // Filter out third-party props from node_modules except @mui packages
      propFilter: (prop) =>
        prop.parent
          ? !/node_modules\/(?!@mui)/.test(prop.parent.fileName)
          : true,
    },
  }
 */