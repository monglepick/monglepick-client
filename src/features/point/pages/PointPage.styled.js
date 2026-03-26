/**
 * PointPage 페이지 레이아웃 styled-components 스타일 정의.
 *
 * 페이지 컨테이너, 제목, 에러, 공통 섹션 기반 스타일 포함.
 * 로컬 keyframe: fadeIn(에러 메시지), bounceIn(출석 결과)
 * 공유 keyframe: fadeInUp(페이지 진입), gradientShift(제목 텍스트)
 *
 * BEM → styled 매핑:
 *   .point-page         → PageWrapper
 *   .point-page__inner  → PageInner
 *   .point-page__title  → PageTitle
 *   .point-page__error  → ErrorBanner
 *   .point-page__section       → Section (하위 컴포넌트에서 공유)
 *   .point-page__section-title → SectionTitle (하위 컴포넌트에서 공유)
 */

import styled, { keyframes } from 'styled-components';
import { fadeInUp, gradientShift } from '../../../shared/styles/animations';
import { media } from '../../../shared/styles/media';

/* ── 로컬 keyframe: 에러 메시지 등장 ── */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* ── 로컬 keyframe: 출석 결과 바운스 인 ── */
/* AttendanceCalendar 컴포넌트에서도 참조 가능하도록 export */
export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  60% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

/** 페이지 최외곽 컨테이너 */
export const PageWrapper = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  ${media.tablet} {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

/** 내부 컨테이너 — 최대 폭 제한 + fadeInUp 등장 애니메이션 */
export const PageInner = styled.div`
  max-width: ${({ theme }) => theme.layout.contentMaxWidth};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeInUp} 0.5s ease forwards;
`;

/** 페이지 제목 — gradientShift 텍스트 */
export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.text2xl};
  font-weight: ${({ theme }) => theme.typography.fontBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  background: ${({ theme }) => theme.gradients.text};
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 4s ease infinite;

  ${media.mobile} {
    font-size: ${({ theme }) => theme.typography.textXl};
  }
`;

/** 글로벌 에러 배너 — fadeIn 등장 */
export const ErrorBanner = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.errorBg};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.textSm};
  animation: ${fadeIn} 0.3s ease;
`;
