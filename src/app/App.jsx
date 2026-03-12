/**
 * 몽글픽 메인 애플리케이션 컴포넌트.
 *
 * ChatWindow를 전체 화면으로 렌더링한다.
 */

/* 채팅 윈도우 컴포넌트 — features/chat에서 가져옴 */
import ChatWindow from '../features/chat/components/ChatWindow';
/* App 전용 레이아웃 스타일 */
import './App.css';

function App() {
  return (
    <div className="app">
      <ChatWindow />
    </div>
  );
}

export default App;
