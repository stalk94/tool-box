module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
	safelist: [
		{
			pattern: /btn-(primary|secondary|accent|ghost|link|neutral|info|success|warning|error)/,
		},
		{
			pattern: /btn-(outline|active|disabled)/,
		},
		{
			pattern: /btn-(xs|sm|md|lg)/,
		},
	]
};