
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import daisyui from 'daisyui'

export default defineConfig({
  plugins: [
    tailwindcss(),
    daisyui
  ],
  daisyui:{
    themes:[
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  }
})


