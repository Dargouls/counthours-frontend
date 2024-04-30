const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
	important: true,
	content: ['./src/**/*.{html,tsx,jsx}'],
	theme: {
		extend: {},
	},
	plugins: [
		plugin(function ({ addBase, theme }) {
			addBase({
				h1: { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.semibold') },
				h2: { fontSize: theme('fontSize.xl') },
				h3: { fontSize: theme('fontSize.lg') },
			});
		}),
	],
};
