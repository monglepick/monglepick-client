/**
 * ChatPage styled-components 정의.
 *
 * ChatWindow 컴포넌트가 페이지 전체 높이를 차지하도록 설정한다.
 * 헤더+푸터 높이를 calc()로 제외하여 남은 뷰포트를 사용한다.
 */

import styled from 'styled-components';

/** 채팅 페이지 컨테이너 — 헤더/푸터를 제외한 뷰포트 높이 전체 사용 */
export const ChatPageWrapper = styled.div`
  width: 100%;
  height: calc(
    100vh - ${({ theme }) => theme.layout.headerHeight} -
      ${({ theme }) => theme.layout.footerHeight}
  );
  display: flex;
  flex-direction: column;
`;
