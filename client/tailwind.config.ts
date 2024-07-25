import flowbitePlugin from 'flowbite/plugin'
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    '../node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbitePlugin],
} satisfies Config
