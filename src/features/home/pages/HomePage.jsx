/**
 * 홈 페이지 (랜딩 페이지) 컴포넌트.
 *
 * 앱의 메인 진입점으로 다음 섹션들을 포함한다:
 * - 히어로 섹션: 서비스 소개 + AI 채팅 시작 버튼
 * - 추천 영화 섹션: 인기/최신 영화 그리드
 * - 빠른 채팅 진입: 추천 질문 카드
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
/* 라우트 경로 상수 — shared/constants에서 가져옴 */
import { ROUTES } from '../../../shared/constants/routes';
/* 영화 목록 컴포넌트 — shared/components에서 가져옴 */
import MovieList from '../../../shared/components/MovieList/MovieList';
/* 인기 영화 API — features/movie에서 가져옴 */
import { getPopularMovies } from '../../movie/api/movieApi';
/* styled-components — HomePage.styled.js */
import * as S from './HomePage.styled';

/** 히어로 섹션에 표시할 추천 질문 카드 목록 */
const SUGGESTION_CARDS = [
  {
    icon: '🎭',
    title: '기분에 맞는 영화',
    description: 'AI가 당신의 감정을 분석해 딱 맞는 영화를 추천해요',
    query: '오늘 기분이 좀 우울한데 힐링되는 영화 추천해줘',
  },
  {
    icon: '🎬',
    title: '비슷한 영화 찾기',
    description: '좋아하는 영화와 비슷한 작품을 찾아드려요',
    query: '인터스텔라 같은 우주 SF 영화 추천해줘',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: '상황별 추천',
    description: '누구와, 어떤 상황에서 볼지 알려주세요',
    query: '주말에 가족이랑 볼 만한 애니메이션 추천해줘',
  },
  {
    icon: '📸',
    title: '이미지로 추천',
    description: '영화 장면이나 포스터를 보여주면 비슷한 영화를 찾아요',
    query: '요즘 넷플릭스에서 볼 만한 한국 영화 추천해줘',
  },
];

export default function HomePage() {
  // 인기 영화 목록 상태
  const [popularMovies, setPopularMovies] = useState([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  /**
   * 컴포넌트 마운트 시 인기 영화를 로드한다.
   * API 호출 실패 시 빈 배열로 처리한다 (에러 전파 방지).
   */
  useEffect(() => {
    async function loadMovies() {
      try {
        const result = await getPopularMovies(1, 8);
        setPopularMovies(result?.movies || []);
      } catch {
        // API 미구현 시 빈 배열로 표시 (스켈레톤 역할)
        setPopularMovies([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadMovies();
  }, []);

  /**
   * 추천 질문 카드 클릭 시 채팅 페이지로 이동.
   * 쿼리를 state로 전달하여 자동 입력되도록 한다.
   *
   * @param {string} query - 추천 질문 텍스트
   */
  const handleSuggestionClick = (query) => {
    navigate(ROUTES.CHAT, { state: { initialQuery: query } });
  };

  return (
    <S.Wrapper>
      {/* ── 히어로 섹션 ── */}
      <S.Hero>
        <S.HeroContent>
          {/* 로고 배지 */}
          <S.HeroBadge>
            <S.HeroBadgeIcon src="/mongle-transparent.png" alt="몽글픽" />
            <span>AI 영화 추천 서비스</span>
          </S.HeroBadge>

          {/* 메인 타이틀 */}
          <S.HeroTitle>
            당신의 취향을 아는
            <br />
            <S.HeroTitleAccent>AI 영화 추천</S.HeroTitleAccent>
          </S.HeroTitle>

          {/* 설명 텍스트 */}
          <S.HeroDesc>
            기분, 장르, 좋아하는 영화를 말씀해 주세요.
            <br />
            몽글픽 AI가 15만 편 이상의 영화 중에서 딱 맞는 작품을 찾아드립니다.
          </S.HeroDesc>

          {/* CTA 버튼 — Link 컴포넌트를 as prop으로 위임 */}
          <S.HeroCta>
            <S.HeroBtnPrimary as={Link} to={ROUTES.CHAT}>
              AI에게 추천받기
            </S.HeroBtnPrimary>
            <S.HeroBtnSecondary as={Link} to={ROUTES.SEARCH}>
              영화 검색하기
            </S.HeroBtnSecondary>
          </S.HeroCta>
        </S.HeroContent>

        {/* 배경 글로우 효과 */}
        <S.HeroGlow aria-hidden="true" />
        {/* Floating Orb 배경 장식 */}
        <S.HeroOrb1 aria-hidden="true" />
        <S.HeroOrb2 aria-hidden="true" />
      </S.Hero>

      {/* ── 추천 질문 카드 섹션 ── */}
      <S.Suggestions>
        <S.SuggestionsInner>
          <S.SuggestionsTitle>이런 것도 물어볼 수 있어요</S.SuggestionsTitle>
          <S.SuggestionsGrid>
            {SUGGESTION_CARDS.map((card, index) => (
              <S.SuggestionsCard
                key={card.title}
                /* $index: 1-based, stagger 딜레이 계산에 사용 */
                $index={index + 1}
                onClick={() => handleSuggestionClick(card.query)}
              >
                <S.CardIcon>{card.icon}</S.CardIcon>
                <S.CardTitle>{card.title}</S.CardTitle>
                <S.CardDesc>{card.description}</S.CardDesc>
              </S.SuggestionsCard>
            ))}
          </S.SuggestionsGrid>
        </S.SuggestionsInner>
      </S.Suggestions>

      {/* ── 인기 영화 섹션 ── */}
      <S.Movies>
        <S.MoviesInner>
          <S.MoviesHeader>
            <S.MoviesTitle>인기 영화</S.MoviesTitle>
            <S.MoviesMore as={Link} to={ROUTES.SEARCH}>
              더 보기 →
            </S.MoviesMore>
          </S.MoviesHeader>
          <MovieList movies={popularMovies} loading={isLoading} />
        </S.MoviesInner>
      </S.Movies>
    </S.Wrapper>
  );
}
