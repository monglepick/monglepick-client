/**
 * 몽글픽 React 애플리케이션 진입점.
 * StrictMode로 감싸서 잠재적 문제를 감지하고,
 * App 컴포넌트를 #root DOM 노드에 마운트한다.
 *
 * styled-components ThemeProvider로 전체 앱을 감싸서
 * 모든 컴포넌트에서 theme 객체에 접근할 수 있게 한다.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'styled-components'
import theme from './shared/styles/theme'
import GlobalStyle from './shared/styles/GlobalStyle'
/* global.css → GlobalStyle.js로 완전 대체 (Phase 6 완료) */
import { ModalProvider } from './shared/components/Modal'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ModalProvider>
        <App />
      </ModalProvider>
    </ThemeProvider>
  </StrictMode>,
)
