import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["var(--font-geist-sans)", ...fontFamily.sans]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
				"Dark-Navy": "#0F222D",
				"Midnight-Blue": "#2D4554",
				"Regent-Gray": "#8196A3",
				"Titan-White": "#FCFDFD",
				"Grass-Green": "#29BC5B",
				"Sunglow": "#F5CB69",
				"Sweet-Red": "#F16350",
				"primary-50": "#FCFDFD",
				"primary-100": "#EAEFF2",
				"primary-200": "#DFE7EC",
				"primary-300": "#BDCED8",
				"primary-400": "#2B6282",
				"primary-500": "#265673",
				"primary-600": "#224D66",
				"primary-700": "#204860",
				"primary-800": "#193A4D",
				"primary-900": "#132B3A",
				"primary-1000": "#0F222D",
				"secondary-50": "#F7FDFD",
				"secondary-100": "#E6F8F8",
				"secondary-200": "#D9F4F4",
				"secondary-300": "#B0E9E9",
				"secondary-400": "#00B7B7",
				"secondary-500": "#00A5A5",
				"secondary-600": "#009292",
				"secondary-700": "#008989",
				"secondary-800": "#006E6E",
				"secondary-900": "#005252",
				"secondary-1000": "#004040",
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
