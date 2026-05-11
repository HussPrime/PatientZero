import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({command}) => ({
  base: command === 'build' ? '/PatientZero/' : '/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov']
    },
  },
}))
