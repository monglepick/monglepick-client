/**
 * PointPackSection 컴포넌트 styled-components 정의.
 *
 * 포인트 팩 카드 그리드 레이아웃 스타일.
 * 순수 CSS(PointPackSection.css)에서 전환됨.
 *
 * 동적 처리:
 *   - BEST 팩 강조 스타일 → $best transient prop
 */

import styled, { css } from 'styled-components';
import { media } from '../../../shared/styles/media';

/* 가로 4열 그리드 컨테이너 */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  /* 태블릿: 2열 */
  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 모바일: 1열 */
  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

/* 최고 혜택(BEST) 팩 추가 스타일 */
const bestCardStyle = css`
  border-color: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.glow};
`;

/* 포인트 팩 카드 — $best prop으로 BEST 스타일 토글 */
export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.bgMain};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radius.lg};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.fast};

  /* BEST 팩 강조 */
  ${({ $best }) => $best && bestCardStyle}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

/* BEST 배지 — 카드 상단 우측에 절대 위치 */
export const Badge = styled.div`
  position: absolute;
  top: -10px;
  right: ${({ theme }) => theme.spacing.md};
  padding: 2px ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.textXs};
  font-weight: ${({ theme }) => theme.typography.fontBold};
  letter-spacing: 0.05em;
`;

/* 포인트 수량 표시 */
export const Points = styled.div`
  font-size: ${({ theme }) => theme.typography.textXl};
  font-weight: ${({ theme }) => theme.typography.fontBold};
  color: ${({ theme }) => theme.colors.primary};
`;

/* 보너스 태그 — gradient-accent 배경 */
export const BonusTag = styled.span`
  display: inline-block;
  padding: 2px ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.gradients.accent};
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.textXs};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
  box-shadow: 0 0 8px rgba(6, 214, 160, 0.2);
`;

/* 가격 표시 */
export const Price = styled.div`
  font-size: ${({ theme }) => theme.typography.textLg};
  font-weight: ${({ theme }) => theme.typography.fontSemibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* 구매 버튼 */
export const BuyButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.textSm};
  font-weight: ${({ theme }) => theme.typography.fontSemibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-top: ${({ theme }) => theme.spacing.xs};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
