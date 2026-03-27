/**
 * 두 영화의 공통 특성 시각화 컴포넌트.
 *
 * shared_features SSE 이벤트로 수신한 데이터를 시각적 배지 태그와
 * 유사도 요약 텍스트로 렌더링한다.
 *
 * 표시 정보:
 * - 공통 장르 배지 (common_genres): 보라색 계열
 * - 공통 무드 배지 (common_moods): 시안 계열
 * - 공통 키워드 배지 (common_keywords): 핑크 계열 (있을 경우)
 * - 공통 감독/출연진 배지 (common_directors, common_cast): 노란색 계열 (있을 경우)
 * - 유사도 요약 텍스트 (similarity_summary): 이탤릭 텍스트
 *
 * fadeInUp 애니메이션으로 부드럽게 등장한다.
 */

import styled, { keyframes } from 'styled-components';

// ── 애니메이션 정의 ──

/** 아래에서 위로 페이드인 등장 애니메이션 */
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/** 배지 하나씩 순서대로 등장하는 팝업 애니메이션 */
const badgePop = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// ── Styled Components ──

/** 컴포넌트 전체 컨테이너 — 글래스모피즘 카드 */
const BadgeContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.glass.bg};
  backdrop-filter: ${({ theme }) => theme.glass.blur};
  border: 1px solid ${({ theme }) => theme.glass.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  animation: ${fadeInUp} 400ms ease both;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

/** 섹션 헤더 — "공통 특성" 제목 */
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/** 섹션 아이콘 */
const SectionIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.textLg};
`;

/** 섹션 제목 텍스트 */
const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.textBase};
  font-weight: ${({ theme }) => theme.typography.fontSemibold};
  /* 그라디언트 텍스트 — 보라→시안 */
  background: ${({ theme }) => theme.gradients.text};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

/** 배지 그룹 래퍼 — 배지 목록 레이블 + 배지들 */
const BadgeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

/** 배지 그룹 레이블 (예: "장르", "무드") */
const GroupLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.textXs};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

/** 배지 목록 — flex wrap */
const BadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

/**
 * 기본 배지 스타일.
 * 배지 타입별로 색상을 달리한다.
 * nth-child로 순서별 딜레이를 줘서 순차 등장 효과를 만든다.
 */
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.textXs};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
  animation: ${badgePop} 300ms ease both;

  /* 배지 인덱스별 등장 딜레이 (최대 12개) */
  &:nth-child(1)  { animation-delay: 50ms; }
  &:nth-child(2)  { animation-delay: 100ms; }
  &:nth-child(3)  { animation-delay: 150ms; }
  &:nth-child(4)  { animation-delay: 200ms; }
  &:nth-child(5)  { animation-delay: 250ms; }
  &:nth-child(6)  { animation-delay: 300ms; }
  &:nth-child(7)  { animation-delay: 350ms; }
  &:nth-child(8)  { animation-delay: 400ms; }
  &:nth-child(9)  { animation-delay: 450ms; }
  &:nth-child(10) { animation-delay: 500ms; }
  &:nth-child(11) { animation-delay: 550ms; }
  &:nth-child(12) { animation-delay: 600ms; }
`;

/** 장르 배지 — 보라색 계열 */
const GenreBadge = styled(Badge)`
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid rgba(124, 108, 240, 0.3);
`;

/** 무드 배지 — 시안 계열 */
const MoodBadge = styled(Badge)`
  background: rgba(6, 214, 160, 0.12);
  color: #06d6a0;
  border: 1px solid rgba(6, 214, 160, 0.25);
`;

/** 키워드 배지 — 핑크 계열 */
const KeywordBadge = styled(Badge)`
  background: rgba(239, 71, 111, 0.12);
  color: #ef476f;
  border: 1px solid rgba(239, 71, 111, 0.25);
`;

/** 인물(감독/배우) 배지 — 노란색 계열 */
const PersonBadge = styled(Badge)`
  background: rgba(251, 191, 36, 0.12);
  color: ${({ theme }) => theme.colors.warning};
  border: 1px solid rgba(251, 191, 36, 0.25);
`;

/** 구분선 */
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  margin: 0;
`;

/** 유사도 요약 텍스트 영역 */
const SummaryText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.textSm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.leadingRelaxed};
  font-style: italic;

  /* 인용 블록 느낌으로 왼쪽 보더 추가 */
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
`;

// ── 컴포넌트 ──

/**
 * 두 영화의 공통 특성 시각화 컴포넌트.
 *
 * @param {Object} props
 * @param {Object} props.sharedFeatures - shared_features SSE 이벤트 데이터
 * @param {string[]} [props.sharedFeatures.common_genres] - 공통 장르 목록
 * @param {string[]} [props.sharedFeatures.common_moods] - 공통 무드 목록
 * @param {string[]} [props.sharedFeatures.common_keywords] - 공통 키워드 목록
 * @param {string[]} [props.sharedFeatures.common_directors] - 공통 감독 목록
 * @param {string[]} [props.sharedFeatures.common_cast] - 공통 출연진 목록
 * @param {string} [props.sharedFeatures.similarity_summary] - 유사도 요약 텍스트
 */
export default function SharedFeaturesBadge({ sharedFeatures }) {
  // 데이터가 없거나 비어있으면 렌더링하지 않음
  if (!sharedFeatures) return null;

  const {
    common_genres = [],
    common_moods = [],
    common_keywords = [],
    common_directors = [],
    common_cast = [],
    similarity_summary,
  } = sharedFeatures;

  // 표시할 배지가 전혀 없으면 렌더링하지 않음
  const hasAnyFeature =
    common_genres.length > 0 ||
    common_moods.length > 0 ||
    common_keywords.length > 0 ||
    common_directors.length > 0 ||
    common_cast.length > 0 ||
    similarity_summary;

  if (!hasAnyFeature) return null;

  return (
    <BadgeContainer role="region" aria-label="두 영화의 공통 특성">
      {/* 섹션 헤더 */}
      <SectionHeader>
        <SectionIcon aria-hidden="true">&#127919;</SectionIcon>
        <SectionTitle>공통 특성</SectionTitle>
      </SectionHeader>

      {/* 공통 장르 배지 */}
      {common_genres.length > 0 && (
        <BadgeGroup>
          <GroupLabel>장르</GroupLabel>
          <BadgeList>
            {common_genres.map((genre) => (
              <GenreBadge key={genre}>{genre}</GenreBadge>
            ))}
          </BadgeList>
        </BadgeGroup>
      )}

      {/* 공통 무드 배지 */}
      {common_moods.length > 0 && (
        <BadgeGroup>
          <GroupLabel>분위기</GroupLabel>
          <BadgeList>
            {common_moods.map((mood) => (
              <MoodBadge key={mood}>{mood}</MoodBadge>
            ))}
          </BadgeList>
        </BadgeGroup>
      )}

      {/* 공통 키워드 배지 — 있을 경우에만 표시 */}
      {common_keywords.length > 0 && (
        <BadgeGroup>
          <GroupLabel>키워드</GroupLabel>
          <BadgeList>
            {/* 키워드는 최대 8개까지만 표시 (UI 과부하 방지) */}
            {common_keywords.slice(0, 8).map((kw) => (
              <KeywordBadge key={kw}>{kw}</KeywordBadge>
            ))}
          </BadgeList>
        </BadgeGroup>
      )}

      {/* 공통 인물(감독 + 주요 출연진) — 있을 경우에만 표시 */}
      {(common_directors.length > 0 || common_cast.length > 0) && (
        <BadgeGroup>
          <GroupLabel>관련 인물</GroupLabel>
          <BadgeList>
            {common_directors.map((name) => (
              <PersonBadge key={`dir-${name}`}>&#127916; {name}</PersonBadge>
            ))}
            {/* 출연진은 최대 4명까지 표시 */}
            {common_cast.slice(0, 4).map((name) => (
              <PersonBadge key={`cast-${name}`}>&#127775; {name}</PersonBadge>
            ))}
          </BadgeList>
        </BadgeGroup>
      )}

      {/* 유사도 요약 텍스트 — 있을 경우에만 표시 */}
      {similarity_summary && (
        <>
          <Divider />
          <SummaryText>{similarity_summary}</SummaryText>
        </>
      )}
    </BadgeContainer>
  );
}
