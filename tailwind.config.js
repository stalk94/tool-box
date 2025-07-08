/** @type {import('tailwindcss').Config} */
module.exports = {
  	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],


	safelist: [
		"w-8", "h-4",
		"sm:w-10", "sm:h-5",
		"md:w-12", "md:h-6",
		"lg:w-14", "lg:h-4",
		"xl:w-18", "xl:h-4",

		"translate-x-1",
		"data-[state=checked]:translate-x-4",
		"sm:data-[state=checked]:translate-x-5",
		"md:data-[state=checked]:translate-x-6",
		"lg:data-[state=checked]:translate-x-7",
		"xl:data-[state=checked]:translate-x-8",
	],


  plugins: [require("daisyui")],
};