import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const isCi = process.env.GITHUB_ACTIONS === 'true'
  return {
    plugins: [react()],
    base: isCi ? '/DifferentEnough/' : '/',
  }
})

