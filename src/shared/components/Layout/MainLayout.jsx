/**
 * 메인 레이아웃 래퍼 컴포넌트.
 *
 * Header + 메인 컨텐츠 영역 + Footer 의 3단 구조를 구성한다.
 * React Router v6+ 의 `<Outlet />` 기반으로 작성되어 App.jsx 의 중첩 라우트에서
 * 한 번만 렌더되면 모든 하위 라우트가 동일 레이아웃을 공유한다.
 *
 * 사용 패턴 (App.jsx):
 *   <Route element={<MainLayout />}>
 *     <Route path="/home"   element={<HomePage />} />
 *     <Route path="/search" element={<SearchPage />} />
 *     // ...
 *   </Route>
 *
 *   <Route element={<MainLayout variant="compact" />}>
 *     <Route path="/chat"            element={<ChatWindow />} />
 *     <Route path="/chat/:sessionId" element={<ChatWindow />} />
 *   </Route>
 *
 * variant 별 차이:
 *   - 'default' (기본): 풀 헤더 + Footer. 모든 유저 페이지에 사용.
 *   - 'compact':         슬림 헤더(상단 NAV 숨김) + Footer 제거. 채팅 전용.
 *     ChatWindow 가 "전체 화면 집중" UX 를 유지하되,
 *     로고/유저 아바타 드롭다운을 남겨 채팅 중에도 다른 섹션 이동이 가능하도록 한다.
 *
 * @param {Object} props
 * @param {'default' | 'compact'} [props.variant='default']
 */

import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { LayoutWrapper, MainContent } from './MainLayout.styled';

export default function MainLayout({ variant = 'default' }) {
  return (
    <LayoutWrapper>
      {/*
        상단 네비게이션 헤더. variant 는 Header 가 직접 해석해
          - 'default' : 전체 NAV + 모바일 햄버거 + 유저 드롭다운
          - 'compact' : 로고 + 유저 드롭다운 + 테마 토글만 (NAV/햄버거 숨김)
        으로 분기한다.
      */}
      <Header variant={variant} />

      {/* 메인 컨텐츠 영역 — 하위 라우트의 element 가 Outlet 자리에 렌더됨 */}
      <MainContent>
        <Outlet />
      </MainContent>

      {/*
        compact 모드에서는 Footer 를 숨긴다 — 채팅 UI 는 뷰포트 하단까지 써야
        메시지 입력창/영화 카드 리스트가 자연스럽게 배치된다. Footer 정보는
        일반 페이지를 통해 언제든 다시 접근 가능하므로 접근성 희생 없음.
      */}
      {variant === 'default' && <Footer />}
    </LayoutWrapper>
  );
}
