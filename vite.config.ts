import {defineConfig} from 'vite'
import {resolve} from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@tokens': resolve(__dirname, 'src/tokens'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  }
})