/**
 * OAuthCallbackPage styled-components 정의.
 *
 * 로딩 스피너와 에러 메시지를 전체 화면 중앙에 표시한다.
 * 스피너는 keyframes spin 애니메이션으로 무한 회전한다.
 */

import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

/** 스피너 회전 애니메이션 */
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/** OAuth 콜백 페이지 전체 컨테이너 — 전체 화면 중앙 정렬 */
export const OAuthCallbackWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.bgMain};
  color: ${({ theme }) => theme.colors.textPrimary};
  gap: 1rem;
`;

/** 로딩 스피너 — 테두리 회전 방식 */
export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

/** 처리 중 안내 메시지 */
export const Message = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** 에러 컨테이너 — 텍스트 중앙 정렬 */
export const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

/** 에러 제목 */
export const ErrorTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.text2xl};
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.error};
`;

/** 에러 설명 텍스트 */
export const ErrorDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 1.5rem;
`;

/** 로그인 페이지로 돌아가기 링크 버튼 — react-router-dom Link 래핑 */
export const BackLink = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;
