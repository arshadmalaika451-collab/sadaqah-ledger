/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#132625',
        paper: '#F5F6F1',
        panel: '#FFFFFF',
        teal: {
          DEFAULT: '#0F3D3E',
          50: '#E7EEEC',
          100: '#CBDBD8',
          400: '#1F5F5C',
          600: '#0F3D3E',
          900: '#0A2827',
        },
        brass: {
          DEFAULT: '#B8892B',
          100: '#F1E3C2',
          400: '#C79A3E',
          600: '#B8892B',
        },
        clay: {
          DEFAULT: '#B5563C',
          100: '#F1DAD1',
          400: '#C46F53',
          600: '#B5563C',
        },
        line: '#DDE1DA',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
      },
    },
  },
  plugins: [],
}
