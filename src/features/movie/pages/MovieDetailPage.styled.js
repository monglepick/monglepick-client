/**
 * MovieDetailPage styled-components 정의.
 *
 * fadeInUp 페이지 등장 + 내부 컨테이너 narrow 너비 제한.
 * 에러 상태와 리뷰 섹션 제목 스타일을 포함한다.
 */

import styled from 'styled-components';
import { fadeInUp } from '../../../shared/styles/animations';

/** 페이지 전체 컨테이너 — fadeInUp 등장 애니메이션 */
export const MovieDetailPageWrapper = styled.div`
  width: 100%;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  animation: ${fadeInUp} 0.5s ease forwards;
`;

/** 내부 콘텐츠 컨테이너 — narrow 너비 + 세로 flex */
export const InnerContainer = styled.div`
  max-width: ${({ theme }) => theme.layout.contentNarrow};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
`;

/** 리뷰 섹션 — 세로 flex */
export const ReviewsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

/** 섹션 제목 */
export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.textXl};
  font-weight: ${({ theme }) => theme.typography.fontBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;

  /* 리뷰 수 표시 span — 보조 텍스트 크기/색상 */
  span {
    font-weight: ${({ theme }) => theme.typography.fontNormal};
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.typography.textBase};
  }
`;

/** 에러 상태 컨테이너 — 중앙 정렬 */
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

/** 에러 제목 */
export const ErrorTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.textXl};
`;

/** 에러 설명 텍스트 */
export const ErrorDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
`;
