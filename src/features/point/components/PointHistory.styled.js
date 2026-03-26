/**
 * PointHistory 컴포넌트 styled-components 스타일 정의.
 *
 * 포인트 이력 테이블 + 페이지네이션.
 * BEM → styled 매핑: .point-page__history-* → History*, .point-page__pagination-* → Pagination*
 */

import styled from 'styled-components';
import { media } from '../../../shared/styles/media';

/** 이력 섹션 래퍼 — 공유 섹션 기반 스타일은 PointPage에서 주입 */
export const HistorySection = styled.section`
  background: ${({ theme }) => theme.glass.bg};
  backdrop-filter: blur(8px) saturate(1.4);
  -webkit-backdrop-filter: blur(8px) saturate(1.4);
  border: 1px solid ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};

  ${media.tablet} {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

/** 섹션 제목 — 아이템 수 카운트 포함 */
export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.textLg};
  font-weight: ${({ theme }) => theme.typography.fontSemibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/** 이력 건수 표시 — 제목 오른쪽 보조 텍스트 */
export const HistoryCount = styled.span`
  font-size: ${({ theme }) => theme.typography.textSm};
  font-weight: ${({ theme }) => theme.typography.fontNormal};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** 빈 이력 상태 */
export const HistoryEmpty = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.textSm};
`;

/** 테이블 가로 스크롤 래퍼 */
export const TableWrapper = styled.div`
  overflow-x: auto;
`;

/** 이력 테이블 */
export const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  /* 태블릿 이하에서 최소 폭 보장 */
  ${media.tablet} {
    min-width: 500px;
  }
`;

/** 테이블 헤더 셀 */
export const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.textSm};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  white-space: nowrap;
`;

/** 테이블 바디 셀 */
export const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.textSm};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

/** 테이블 행 — hover 시 배경 강조 */
export const Tr = styled.tr`
  &:hover td {
    background-color: ${({ theme }) => theme.colors.bgElevated};
  }
`;

/** 내용 열 — 텍스트 오버플로우 말줄임 */
export const DescCell = styled(Td)`
  color: ${({ theme }) => theme.colors.textPrimary};
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

/**
 * 변동 열 — 양수(초록)/음수(빨강) 조건부 색상.
 * $positive: true → 초록, false → 빨강
 */
export const ChangeCell = styled(Td)`
  font-weight: ${({ theme }) => theme.typography.fontSemibold};
  white-space: nowrap;
  color: ${({ theme, $positive }) =>
    $positive ? theme.colors.success : theme.colors.error};
`;

/** 잔액 열 */
export const AfterCell = styled(Td)`
  white-space: nowrap;
`;

/** 일시 열 */
export const DateCell = styled(Td)`
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** 페이지네이션 래퍼 */
export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

/** 페이지네이션 버튼 */
export const PaginationBtn = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.textSm};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

/** 페이지 번호 표시 */
export const PaginationInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.textSm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
