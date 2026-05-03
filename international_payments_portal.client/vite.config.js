import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 62034,
        proxy: {
            '/api': {
                target: 'https://localhost:5001',  // Changed to new port
                changeOrigin: true,
                secure: false
            }
        }
    }
})