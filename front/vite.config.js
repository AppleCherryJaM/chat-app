import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// const config = ({mode}) => {
//   const { BE_URL } = loadEnv(mode, process.cwd())
// };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
