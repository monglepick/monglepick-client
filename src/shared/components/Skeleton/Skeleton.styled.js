/**
 * Skeleton styled-components.
 *
 * 데이터 로딩 중 콘텐츠 자리를 표시하는 shimmer(반짝임) 효과.
 * $variant props로 형태를 결정한다 (text, circular, rectangular, card).
 */

import styled, { keyframes } from 'styled-components';

/** shimmer 키프레임 애니메이션 — 좌→우 반복 이동 */
const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/** shimmer 공통 배경 mixin */
const shimmerBg = (theme) => `
  background: linear-gradient(
    90deg,
    ${theme.colors.bgSecondary} 25%,
    ${theme.colors.bgTertiary} 50%,
    ${theme.colors.bgSecondary} 75%
  );
  background-size: 200% 100%;
`;

/** variant별 border-radius 매핑 */
const variantRadius = {
  text: (theme) => theme.radius.sm,
  circular: (theme) => theme.radius.full,
  rectangular: (theme) => theme.radius.md,
  card: (theme) => theme.radius.lg,
};

/** 기본 스켈레톤 블록 — text / circular / rectangular 공통 */
export const SkeletonBlock = styled.div`
  ${({ theme }) => shimmerBg(theme)}
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${({ $variant, theme }) =>
    variantRadius[$variant]?.(theme) || theme.radius.md};
`;

/** card variant — 카드 형태 컨테이너 */
export const CardWrapper = styled.div`
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

/** 카드 포스터 영역 (2:3 비율) */
export const CardPoster = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  ${({ theme }) => shimmerBg(theme)}
  animation: ${shimmer} 1.5s ease-in-out infinite;
`;

/** 카드 정보 영역 */
export const CardInfo = styled.div`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.bgCard};
`;

/** 카드 제목 줄 */
export const CardTitle = styled.div`
  height: 16px;
  width: 80%;
  ${({ theme }) => shimmerBg(theme)}
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.radius.sm};
`;

/** 카드 장르 줄 */
export const CardGenre = styled.div`
  height: 12px;
  width: 50%;
  ${({ theme }) => shimmerBg(theme)}
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: ${({ theme }) => theme.radius.sm};
`;
