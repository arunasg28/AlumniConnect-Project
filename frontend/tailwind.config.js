import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			animation: {
			  fadeIn: "fadeIn 2s ease-in-out",
			  slideIn: "slideIn 1.5s ease-in-out",
			},
			keyframes: {
			  fadeIn: {
				from: { opacity: 0 },
				to: { opacity: 1 },
			  },
			  slideIn: {
				from: { transform: "translateX(100%)", opacity: 0 },
				to: { transform: "translateX(0)", opacity: 1 },
			  },
			},
		  },
		},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				normal: {
					primary: "#0A66C2", 
					secondary: "#FFFFFF", // White
					accent: "#7FC15E", 
					neutral: "#000000", // Black (for text)
					"base-100": "#F3F2EF", // Light Gray (background)
					info: "#5E5E5E", // Dark Gray (for secondary text)
					success: "#057642", // Dark Green (for success messages)
					warning: "#F5C75D", // Yellow (for warnings)
					error: "#991b1b", // Red (for errors)
				},
			},
		],
	},
};
