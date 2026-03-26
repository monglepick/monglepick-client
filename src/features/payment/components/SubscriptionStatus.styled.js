/**
 * SubscriptionStatus 컴포넌트 styled-components 정의.
 *
 * 구독 상태 카드와 취소 버튼 스타일.
 * 순수 CSS(SubscriptionStatus.css)에서 전환됨.
 *
 * 인라인 스타일 제거:
 *   - 상태(status)별 색상 → $status transient prop으로 매핑
 */

import styled from 'styled-components';
import { media } from '../../../shared/styles/media';

/* ── 상태(status)별 색상 매핑 헬퍼 ── */
const getStatusColor = ({ $status, theme }) => {
  if ($status === 'ACTIVE') return theme.colors.success;
  if ($status === 'CANCELLED') return theme.colors.warning;
  return theme.colors.textSecondary;
};

/* 구독 없음 안내 래퍼 */
export const EmptyWrapper = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

/* 구독 없음 — 안내 본문 */
export const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.textBase};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

/* 구독 없음 — 보조 힌트 */
export const EmptyHint = styled.p`
  font-size: ${({ theme }) => theme.typography.textSm};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

/* 활성 구독 정보 카드 */
export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

/* 구독 정보 필드 목록 */
export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

/* 개별 정보 행 — 라벨 + 값 */
export const Field = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  /* 모바일: 세로 배치 */
  ${media.tablet} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    align-items: flex-start;
  }
`;

/* 필드 라벨 */
export const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.textSm};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
  color: ${({ theme }) => theme.colors.textMuted};
  min-width: 80px;
`;

/* 필드 값 — $status prop으로 색상 결정 */
export const Value = styled.span`
  font-size: ${({ theme }) => theme.typography.textBase};
  /* $status가 있으면 상태 색상, 없으면 기본 textPrimary */
  color: ${(props) =>
    props.$status ? getStatusColor(props) : props.theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
`;

/* 구독 취소 버튼 — ACTIVE 상태에서만 노출 */
export const CancelButton = styled.button`
  align-self: flex-start;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.textSm};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.errorBg};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
