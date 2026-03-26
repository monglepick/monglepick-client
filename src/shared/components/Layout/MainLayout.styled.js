/**
 * MainLayout styled-components.
 *
 * Flexbox column 레이아웃으로 Header-Content-Footer 구조를 구성한다.
 * 컨텐츠가 적더라도 Footer가 화면 하단에 붙도록 min-height: 100vh를 적용한다.
 */

import styled from 'styled-components';

/** 레이아웃 전체 컨테이너 */
export const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bgMain};
`;

/** 메인 컨텐츠 영역 — 남은 공간을 모두 차지 */
export const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;
