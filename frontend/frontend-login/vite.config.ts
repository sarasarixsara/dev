import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    ElementPlus(),
    vue(),
    federation({
      name: 'frontend-login',
      filename: 'remoteEntry.js',
      exposes: {
          './Recommendations': './src/components/Recommendations.vue',
      },
      shared: ['vue', 'pinia']
    })
  ],
  base: 'http://localhost:5001',
  build: {
    minify: false,
    target: ["chrome89", "edge89", "firefox89", "safari15"]
 }
})
