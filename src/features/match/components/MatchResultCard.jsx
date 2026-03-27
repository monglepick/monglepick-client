/**
 * Movie Match 추천 결과 카드 컴포넌트.
 *
 * match_result SSE 이벤트로 수신한 추천 영화 1편을 시각적 카드로 렌더링한다.
 *
 * 표시 정보:
 * - 순위 배지 (rank): 1~5위 숫자 배지
 * - 포스터 이미지 (poster_path): lazy loading, TMDB w342
 * - 영화 제목 (title)
 * - 장르 태그 (genres)
 * - 개봉연도 (release_year) + 평점 (rating)
 * - 영화A 유사도 프로그레스 바 (score_detail.sim_to_movie_1)
 * - 영화B 유사도 프로그레스 바 (score_detail.sim_to_movie_2)
 * - 추천 이유 텍스트 (explanation)
 * - 카드 클릭 시 /movie/:id 페이지로 이동
 *
 * slideInUp 애니메이션으로 rank 순서대로 순차 등장한다.
 */

import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
/* 라우트 상수 + buildPath 헬퍼 */
import { ROUTES, buildPath } from '../../../shared/constants/routes';
/* 포맷터 유틸 */
import { formatRating, truncateText, genreMapper } from '../../../shared/utils/formatters';
/* 미디어쿼리 헬퍼 */
import { media } from '../../../shared/styles/media';

// ── 애니메이션 정의 ──

/** 카드 등장 — 아래에서 위로 슬라이드인 */
const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/** 프로그레스 바 채움 애니메이션 */
const fillBar = keyframes`
  from { width: 0%; }
  to   { width: var(--bar-width); }
`;

// ── Styled Components ──

/**
 * 카드 최상위 래퍼.
 * rank에 따라 등장 딜레이를 다르게 적용하여 순차 등장 효과를 만든다.
 */
const CardWrapper = styled.article`
  animation: ${slideInUp} 450ms ease both;
  /* rank(1~5) 기반 등장 딜레이 — props.rank를 CSS animation-delay로 변환 */
  animation-delay: ${({ $rank }) => ($rank - 1) * 100}ms;
  cursor: pointer;

  &:hover > div {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
    transform: translateY(-2px);
  }
`;

/** 카드 내부 컨테이너 — 글래스모피즘 */
const CardInner = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radius.xl};
  transition:
    border-color ${({ theme }) => theme.transitions.base},
    box-shadow ${({ theme }) => theme.transitions.base},
    transform ${({ theme }) => theme.transitions.base};

  ${media.mobile} {
    flex-direction: column;
  }
`;

/** 포스터 래퍼 — 순위 배지 기준점 */
const PosterWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

/** 영화 포스터 이미지 */
const Poster = styled.img`
  width: 90px;
  height: 135px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgSecondary};
  display: block;

  ${media.mobile} {
    width: 100%;
    height: 180px;
  }
`;

/**
 * 순위 배지.
 * 1위는 황금색, 2위는 은색, 3위는 구리색, 나머지는 기본 보라색.
 */
const RankBadge = styled.span`
  position: absolute;
  top: -6px;
  left: -6px;
  width: 26px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.textXs};
  font-weight: ${({ theme }) => theme.typography.fontBold};
  color: #fff;
  box-shadow: ${({ theme }) => theme.shadows.md};

  /* 1~3위 특별 색상, 4~5위 기본 보라 */
  ${({ $rank, theme }) => {
    if ($rank === 1) return css`background: linear-gradient(135deg, #ffd700, #ffaa00);`;
    if ($rank === 2) return css`background: linear-gradient(135deg, #c0c0c0, #a0a0a0);`;
    if ($rank === 3) return css`background: linear-gradient(135deg, #cd7f32, #a0522d);`;
    return css`background: ${theme.colors.primary};`;
  }}
`;

/** 카드 오른쪽 정보 영역 */
const InfoArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-width: 0;
`;

/** 제목 + 메타 정보 행 */
const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/** 영화 제목 */
const Title = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.textBase};
  font-weight: ${({ theme }) => theme.typography.fontBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/** 연도 · 평점 메타 정보 */
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.textSm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** 별 평점 강조 */
const RatingText = styled.span`
  color: ${({ theme }) => theme.colors.starFilled};
  font-weight: ${({ theme }) => theme.typography.fontSemibold};
`;

/** 장르 태그 목록 */
const GenreList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

/** 장르 태그 하나 */
const GenreTag = styled.span`
  padding: 2px ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.textXs};
  font-weight: ${({ theme }) => theme.typography.fontMedium};
`;

/** 유사도 섹션 전체 래퍼 */
const SimilaritySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

/** 유사도 항목 하나 (레이블 + 바) */
const SimilarityItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

/** 유사도 항목 헤더 (레이블 + 퍼센트) */
const SimilarityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/** 유사도 레이블 텍스트 */
const SimilarityLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.textXs};
  color: ${({ theme }) => theme.colors.textSecondary};
  /* 영화 제목이 너무 길 경우 말줄임 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
`;

/** 유사도 퍼센트 텍스트 */
const SimilarityPercent = styled.span`
  font-size: ${({ theme }) => theme.typography.textXs};
  font-weight: ${({ theme }) => theme.typography.fontSemibold};
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

/** 프로그레스 바 배경 트랙 */
const SimilarityTrack = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
`;

/**
 * 프로그레스 바 채움 부분.
 * --bar-width CSS 변수를 통해 fillBar 애니메이션의 목표값을 전달한다.
 * $color prop으로 영화A/B를 시각적으로 구분한다.
 */
const SimilarityFill = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.full};
  /* CSS 변수로 너비 전달 — fillBar 키프레임이 이 변수를 참조 */
  --bar-width: ${({ $percent }) => $percent}%;
  width: ${({ $percent }) => $percent}%;
  /* 영화A: 보라, 영화B: 시안 */
  background: ${({ $color, theme }) =>
    $color === 'cyan'
      ? 'linear-gradient(90deg, #06d6a0, #06b894)'
      : `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`};
  animation: ${fillBar} 800ms ease both;
  /* rank 기반 카드 등장 딜레이 + 추가 딜레이 */
  animation-delay: ${({ $delay }) => $delay}ms;
`;

/** 추천 이유 텍스트 */
const Explanation = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.textSm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.leadingRelaxed};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.bgElevated};
  border-radius: ${({ theme }) => theme.radius.md};
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
`;

// ── 헬퍼 함수 ──

/**
 * TMDB 포스터 이미지 URL을 생성한다.
 *
 * @param {string|null} posterPath - TMDB poster_path (예: '/abc.jpg')
 * @param {string} [size='w342'] - TMDB 이미지 사이즈
 * @returns {string} 이미지 URL
 */
function getPosterUrl(posterPath, size = 'w342') {
  if (!posterPath) {
    return 'https://placehold.co/90x135/1a1a2e/666?text=No+Poster';
  }
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

/**
 * 유사도 점수(0.0~1.0)를 퍼센트(0~100) 정수로 변환한다.
 * 이미 0~100 범위면 그대로 반올림한다.
 *
 * @param {number|null|undefined} score - 유사도 점수
 * @returns {number} 0~100 정수
 */
function toPercent(score) {
  if (score == null || isNaN(Number(score))) return 0;
  const num = Number(score);
  // 0~1 범위이면 100을 곱해서 퍼센트로 변환
  if (num <= 1.0) return Math.round(num * 100);
  // 이미 퍼센트 범위(1~100)이면 반올림
  return Math.round(Math.min(num, 100));
}

// ── 컴포넌트 ──

/**
 * Movie Match 추천 결과 카드.
 *
 * @param {Object} props
 * @param {Object} props.movie - 추천 영화 데이터 (match_result.movies[] 항목)
 * @param {number} props.movie.rank - 추천 순위 (1~5)
 * @param {string} props.movie.movie_id - 영화 ID (/movie/:id 이동에 사용)
 * @param {string} props.movie.title - 영화 제목
 * @param {string[]} [props.movie.genres] - 장르 목록
 * @param {number} [props.movie.release_year] - 개봉연도
 * @param {number} [props.movie.rating] - 평점 (0~10)
 * @param {string} [props.movie.poster_path] - TMDB 포스터 경로
 * @param {Object} [props.movie.score_detail] - 유사도 상세
 * @param {number} [props.movie.score_detail.sim_to_movie_1] - 영화A 유사도 (0~1)
 * @param {number} [props.movie.score_detail.sim_to_movie_2] - 영화B 유사도 (0~1)
 * @param {number} [props.movie.score_detail.match_score] - 종합 매치 점수 (0~1)
 * @param {string} [props.movie.explanation] - 추천 이유 텍스트
 * @param {string} props.movie1Title - 첫 번째 선택 영화 제목 (유사도 레이블에 사용)
 * @param {string} props.movie2Title - 두 번째 선택 영화 제목 (유사도 레이블에 사용)
 */
export default function MatchResultCard({ movie, movie1Title, movie2Title }) {
  const navigate = useNavigate();

  const {
    rank = 1,
    movie_id,
    title,
    genres = [],
    release_year,
    rating,
    poster_path,
    score_detail = {},
    explanation,
  } = movie;

  const {
    sim_to_movie_1,
    sim_to_movie_2,
  } = score_detail;

  // 유사도 퍼센트 계산
  const percent1 = toPercent(sim_to_movie_1);
  const percent2 = toPercent(sim_to_movie_2);

  // rank 기반 카드 등장 딜레이 (ms) — 카드마다 100ms씩 늦게 등장
  const cardDelay = (rank - 1) * 100;
  // 프로그레스 바는 카드 등장 완료 후 시작 (카드 딜레이 + 200ms)
  const barDelay = cardDelay + 200;

  /**
   * 카드 클릭 핸들러 — 영화 상세 페이지로 이동.
   * movie_id가 없으면 이동하지 않는다.
   */
  const handleCardClick = () => {
    if (!movie_id) return;
    // buildPath로 /movie/:id 경로 생성
    navigate(buildPath(ROUTES.MOVIE_DETAIL, { id: movie_id }));
  };

  return (
    <CardWrapper
      $rank={rank}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`${rank}위 추천: ${title}`}
      /* 키보드 접근성 — Enter/Space로 클릭 */
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <CardInner>
        {/* 포스터 + 순위 배지 */}
        <PosterWrapper>
          <Poster
            src={getPosterUrl(poster_path)}
            alt={`${title} 포스터`}
            loading="lazy"
          />
          <RankBadge $rank={rank} aria-label={`${rank}위`}>
            {rank}
          </RankBadge>
        </PosterWrapper>

        {/* 영화 정보 영역 */}
        <InfoArea>
          {/* 제목 + 메타 */}
          <TitleRow>
            <Title title={title}>{title}</Title>
            <MetaRow>
              {release_year && <span>{release_year}</span>}
              {rating != null && (
                <RatingText>★ {formatRating(rating)}</RatingText>
              )}
            </MetaRow>
          </TitleRow>

          {/* 장르 태그 — 최대 4개 */}
          {genres.length > 0 && (
            <GenreList>
              {genres.slice(0, 4).map((g) => (
                <GenreTag key={g}>{genreMapper(g)}</GenreTag>
              ))}
            </GenreList>
          )}

          {/* 유사도 프로그레스 바 2개 */}
          <SimilaritySection>
            {/* 영화A 유사도 */}
            {sim_to_movie_1 != null && (
              <SimilarityItem>
                <SimilarityHeader>
                  <SimilarityLabel title={movie1Title}>
                    {truncateText(movie1Title, 16)} 유사도
                  </SimilarityLabel>
                  <SimilarityPercent>{percent1}%</SimilarityPercent>
                </SimilarityHeader>
                <SimilarityTrack>
                  <SimilarityFill
                    $percent={percent1}
                    $color="purple"
                    $delay={barDelay}
                    role="progressbar"
                    aria-valuenow={percent1}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </SimilarityTrack>
              </SimilarityItem>
            )}

            {/* 영화B 유사도 */}
            {sim_to_movie_2 != null && (
              <SimilarityItem>
                <SimilarityHeader>
                  <SimilarityLabel title={movie2Title}>
                    {truncateText(movie2Title, 16)} 유사도
                  </SimilarityLabel>
                  <SimilarityPercent>{percent2}%</SimilarityPercent>
                </SimilarityHeader>
                <SimilarityTrack>
                  <SimilarityFill
                    $percent={percent2}
                    $color="cyan"
                    $delay={barDelay + 100}
                    role="progressbar"
                    aria-valuenow={percent2}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </SimilarityTrack>
              </SimilarityItem>
            )}
          </SimilaritySection>

          {/* 추천 이유 텍스트 — 있을 경우에만 표시 */}
          {explanation && (
            <Explanation>{truncateText(explanation, 150)}</Explanation>
          )}
        </InfoArea>
      </CardInner>
    </CardWrapper>
  );
}
