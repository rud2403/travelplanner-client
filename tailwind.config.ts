import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'progress': 'progress 1.5s ease-in-out infinite',
        'blob': 'blob 7s infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
      },
      keyframes: {
        progress: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0)' },
        },
        blob: {
          '0%, 100%': { 
            transform: 'translate(0, 0) scale(1)',
          },
          '33%': { 
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': { 
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
        },
        'gradient-x': {
          '0%, 100%': { 
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': { 
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-y': {
          '0%, 100%': { 
            'background-size': '200% 200%',
            'background-position': 'center top'
          },
          '50%': { 
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          }
        }
      }
    }
  },
  plugins: [],
};
export default config;
