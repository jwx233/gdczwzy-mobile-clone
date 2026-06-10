import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/gdczwzy-mobile-clone/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
})
