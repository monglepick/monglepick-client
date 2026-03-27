import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      plugins: [
        /* styled-components: 개발 시 컴포넌트 이름 표시 (DevTools 디버깅용) */
        ['@swc/plugin-styled-components', { displayName: true, ssr: false }],
      ],
    }),
  ],
  server: {
    // 모든 네트워크 인터페이스에서 접근 허용 (LAN/외부 디바이스 테스트용)
    host: '0.0.0.0',
    // 프록시 제거 — 각 API 모듈에서 서비스 URL 직접 호출 (serviceUrls.js)
  },
})
