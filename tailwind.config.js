/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg:           '#070b15',
          surface:      '#0c1124',
          card:         '#0f1630',
          border:       '#1a2d4a',
          accent:       '#00d4b8',
          'accent-dim': '#009e89',
          blue:         '#4f8ef7',
          pink:         '#f43f5e',
          text:         '#c8d6ea',
          muted:        '#4a5e78',
          dim:          '#1e304d',
        }
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(0,212,184,0.15)',
        'glow':    '0 0 20px rgba(0,212,184,0.2)',
        'glow-lg': '0 0 40px rgba(0,212,184,0.25)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
