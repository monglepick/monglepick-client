/**
 * Movie Match 메인 페이지 컴포넌트.
 *
 * 두 영화를 선택하면 AI가 공통 특성을 분석하여 "함께 볼 영화"를 추천한다.
 *
 * 페이지 구성:
 * 1. 헤더 — 페이지 제목 + 설명
 * 2. 영화 선택 영역 — 영화A / VS 디바이더 / 영화B (MovieSelector x2)
 * 3. 분석 시작 버튼 — 두 영화 선택 완료 시 활성화
 * 4. 진행 상태 목록 — 완료된 단계 체크마크 + 현재 단계 스피너
 * 5. 공통 특성 배지 — SharedFeaturesBadge (shared_features 이벤트 수신 후 표시)
 * 6. 추천 결과 — MatchResultCard 5장 (match_result 이벤트 수신 후 표시)
 *
 * 반응형: 모바일(≤768px)에서 영화 선택 영역을 세로로 배치한다.
 *
 * 상태 관리는 useMatch 훅에 위임한다.
 * 인증 상태는 Zustand useAuthStore에서 가져온다.
 */

import styled, { keyframes, css } from 'styled-components';
/* Match 상태 관리 훅 */
import { useMatch } from '../hooks/useMatch';
/* Zustand 인증 스토어 — 사용자 ID 추출 */
import useAuthStore from '../../../shared/stores/useAuthStore';
/* 하위 컴포넌트 */
import MovieSelector from '../components/MovieSelector';
import SharedFeaturesBadge from '../components/SharedFeaturesBadge';
import MatchResultCard from '../components/MatchResultCard';

// ── 애니메이션 정의 ──

/** 페이지 최초 진입 페이드인 */
const pageFadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** 스피너 회전 */
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

/** 결과 섹션 등장 */
const sectionFadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** 버튼 호버 글로우 pulse */
const glowPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(124, 108, 240, 0.4); }
  70%  { box-shadow: 0 0 0 10px rgba(124, 108, 240, 0); }
  100% { box-shadow: 0 0 0 0 rgba(124, 108, 240, 0); }
`;

// ── Styled Components ──

/** 페이지 전체 래퍼 */
const PageContainer = styled.main`
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
  animation: ${pageFadeIn} 500ms ease both;

  @media (max-width: 768px) {
    padding: var(--space-lg) var(--space-md);
    gap: var(--space-xl);
  }
`;

/** 페이지 헤더 섹션 */
const PageHeader = styled.header`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

/** 페이지 제목 */
const PageTitle = styled.h1`
  margin: 0;
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  /* 그라디언트 텍스트 — 보라→시안→블루 */
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
`;

/** 페이지 부제목 */
const PageSubtitle = styled.p`
  margin: 0;
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

/** 영화 선택 영역 — 두 MovieSelector와 VS 디바이더를 가로 배치 */
const SelectorRow = styled.section`
  display: grid;
  /* 영화A | VS | 영화B — 양쪽 셀렉터는 flex:1, VS는 고정폭 */
  grid-template-columns: 1fr auto 1fr;
  align-items: start;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);

  /* 모바일: 세로 배치 */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
    padding: var(--space-md);
  }
`;

/** VS 디바이더 */
const VsDivider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 28px; /* 레이블 높이만큼 오프셋 */
  gap: var(--space-xs);
`;

/** VS 텍스트 */
const VsText = styled.span`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  /* 그라디언트 텍스트 */
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
`;

/** VS 위아래 장식선 */
const VsLine = styled.div`
  width: 1px;
  height: 24px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--border-default),
    transparent
  );

  /* 모바일에서 숨기기 */
  @media (max-width: 768px) {
    display: none;
  }
`;

/** 분석 버튼 영역 */
const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
`;

/**
 * "함께 볼 영화 찾기" 버튼.
 * 두 영화가 모두 선택되어야 활성화된다.
 * 로딩 중에는 비활성화 + 취소 버튼으로 전환한다.
 */
const MatchButton = styled.button`
  padding: var(--space-md) var(--space-2xl);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  font-family: var(--font-family);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    background var(--transition-base),
    opacity var(--transition-base),
    transform var(--transition-fast),
    box-shadow var(--transition-base);

  /* 활성화 상태 — 그라디언트 배경 */
  ${({ $active }) =>
    $active
      ? css`
          background: var(--gradient-primary);
          color: #fff;
          &:hover {
            transform: translateY(-2px);
            box-shadow: var(--glow-primary);
            animation: ${glowPulse} 1.5s ease infinite;
          }
          &:active {
            transform: translateY(0);
          }
        `
      : css`
          background: var(--bg-elevated);
          color: var(--text-muted);
          cursor: not-allowed;
          opacity: 0.6;
        `}

  /* 로딩(취소) 상태 */
  ${({ $cancel }) =>
    $cancel &&
    css`
      background: rgba(248, 113, 113, 0.15);
      color: var(--error);
      border: 1px solid rgba(248, 113, 113, 0.3);
      cursor: pointer;
      opacity: 1;
      &:hover {
        background: rgba(248, 113, 113, 0.25);
      }
    `}
`;

/** 진행 상태 섹션 */
const StatusSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  animation: ${sectionFadeIn} 400ms ease both;
`;

/** 진행 상태 섹션 제목 */
const StatusSectionTitle = styled.h2`
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

/** 진행 상태 항목 목록 */
const StatusList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

/** 진행 상태 항목 하나 */
const StatusItem = styled.li`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: ${({ $completed }) => ($completed ? 'var(--success)' : 'var(--text-primary)')};
  transition: color var(--transition-base);
`;

/** 상태 아이콘 — 완료(체크) 또는 진행 중(스피너) */
const StatusIcon = styled.span`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-base);

  /* 진행 중 스피너 애니메이션 */
  ${({ $spinning }) =>
    $spinning &&
    css`
      animation: ${spin} 800ms linear infinite;
    `}
`;

/** 상태 메시지 텍스트 */
const StatusMessage = styled.span`
  flex: 1;
`;

/** 에러 배너 */
const ErrorBanner = styled.div`
  padding: var(--space-md) var(--space-lg);
  background: var(--error-bg);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: var(--radius-lg);
  color: var(--error);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  animation: ${sectionFadeIn} 300ms ease both;
`;

/** 추천 결과 섹션 */
const ResultsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  animation: ${sectionFadeIn} 400ms ease both;
`;

/** 결과 섹션 헤더 */
const ResultsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

/** 결과 섹션 제목 */
const ResultsTitle = styled.h2`
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

/** 추천 결과 카드 목록 */
const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

/**
 * 진행 단계 정의.
 * Agent가 보내는 phase 코드와 사용자에게 표시할 레이블을 매핑한다.
 * 순서대로 체크마크가 채워진다.
 */
const PHASE_LABELS = {
  movie_loader:          '영화 정보 로드',
  feature_extractor:     '공통점 분석',
  query_builder:         '검색 쿼리 생성',
  rag_retriever:         '비슷한 영화 검색',
  match_scorer:          '매치 점수 계산',
  explanation_generator: '추천 이유 생성',
};

// ── 컴포넌트 ──

/**
 * Movie Match 메인 페이지.
 * useMatch 훅으로 상태를 관리하며, Zustand에서 userId를 가져온다.
 */
export default function MatchPage() {
  /* Zustand 스토어에서 인증된 사용자 ID 가져오기 */
  const user = useAuthStore((s) => s.user);
  const userId = user?.userId || user?.id || '';

  /* Match 상태 + 액션 훅 */
  const {
    selectedMovie1,
    selectedMovie2,
    sharedFeatures,
    matchResults,
    currentStatus,
    completedPhases,
    isLoading,
    error,
    selectMovie1,
    selectMovie2,
    clearMovie1,
    clearMovie2,
    startMatch,
    cancelRequest,
    reset,
  } = useMatch({ userId });

  /* 두 영화가 모두 선택되었는지 여부 */
  const canStart = !!selectedMovie1 && !!selectedMovie2 && !isLoading;

  /**
   * 버튼 클릭 핸들러.
   * 로딩 중이면 요청을 취소하고, 아니면 분석을 시작한다.
   */
  const handleButtonClick = () => {
    if (isLoading) {
      cancelRequest();
    } else if (canStart) {
      startMatch();
    }
  };

  /**
   * 버튼 레이블 결정.
   * - 로딩 중: "분석 취소"
   * - 두 영화 미선택: "영화를 두 편 선택해주세요"
   * - 준비 완료: "함께 볼 영화 찾기"
   */
  const buttonLabel = isLoading
    ? '분석 취소'
    : !selectedMovie1 || !selectedMovie2
      ? '영화를 두 편 선택해주세요'
      : '함께 볼 영화 찾기';

  /**
   * 진행 상태 목록 렌더링용 데이터 계산.
   * completedPhases + currentPhase를 기반으로 각 단계의 상태를 결정한다.
   */
  const phaseEntries = Object.entries(PHASE_LABELS);

  return (
    <PageContainer>
      {/* ── 헤더 ── */}
      <PageHeader>
        <PageTitle>Movie Match</PageTitle>
        <PageSubtitle>
          두 영화를 선택하면 AI가 공통점을 분석하여<br />
          함께 볼 영화를 추천해드립니다.
        </PageSubtitle>
      </PageHeader>

      {/* ── 영화 선택 영역 ── */}
      <SelectorRow aria-label="영화 선택">
        {/* 영화 A 셀렉터 */}
        <MovieSelector
          label="영화 A"
          selectedMovie={selectedMovie1}
          onSelect={selectMovie1}
          onClear={clearMovie1}
        />

        {/* VS 디바이더 */}
        <VsDivider aria-hidden="true">
          <VsLine />
          <VsText>VS</VsText>
          <VsLine />
        </VsDivider>

        {/* 영화 B 셀렉터 */}
        <MovieSelector
          label="영화 B"
          selectedMovie={selectedMovie2}
          onSelect={selectMovie2}
          onClear={clearMovie2}
        />
      </SelectorRow>

      {/* ── 분석 시작 / 취소 버튼 ── */}
      <ButtonArea>
        <MatchButton
          onClick={handleButtonClick}
          $active={canStart || isLoading}
          $cancel={isLoading}
          disabled={!canStart && !isLoading}
          aria-label={buttonLabel}
        >
          {isLoading ? (
            /* 로딩 중: 스피너 아이콘 + 취소 레이블 */
            <>&#9679; {buttonLabel}</>
          ) : (
            /* 준비: 타깃 아이콘 + 레이블 */
            <>&#127919; {buttonLabel}</>
          )}
        </MatchButton>
      </ButtonArea>

      {/* ── 에러 배너 ── */}
      {error && (
        <ErrorBanner role="alert">
          <span aria-hidden="true">&#9888;</span>
          <span>{error}</span>
        </ErrorBanner>
      )}

      {/* ── 진행 상태 목록 — 로딩 중이거나 완료된 단계가 있을 때 표시 ── */}
      {(isLoading || completedPhases.length > 0) && (
        <StatusSection aria-label="분석 진행 상태">
          <StatusSectionTitle>분석 진행 상태</StatusSectionTitle>
          <StatusList>
            {phaseEntries.map(([phase, label]) => {
              const isCompleted = completedPhases.includes(phase);
              /* 현재 진행 중인 phase는 currentStatus에서 추출한 phase와 비교 */
              const isCurrent = isLoading && !isCompleted && currentStatus !== '' &&
                /* Agent가 이 phase의 status를 보내는 중인지 판단:
                   completedPhases에 없으면서 완료된 phase 다음 순서 */
                phaseEntries.findIndex(([p]) => p === phase) ===
                completedPhases.length;

              /* 이 단계가 아직 도달하지 않은 미래 단계인지 */
              const isFuture = !isCompleted && !isCurrent;

              return (
                <StatusItem
                  key={phase}
                  $completed={isCompleted}
                  aria-label={`${label}: ${isCompleted ? '완료' : isCurrent ? '진행 중' : '대기'}`}
                >
                  <StatusIcon $spinning={isCurrent} aria-hidden="true">
                    {isCompleted
                      ? '✅'      /* 완료 */
                      : isCurrent
                        ? '⏳'    /* 진행 중 (스피너) */
                        : '○'    /* 미래 단계 */}
                  </StatusIcon>
                  <StatusMessage
                    style={{ color: isFuture ? 'var(--text-muted)' : undefined }}
                  >
                    {label}
                    {/* 현재 단계이면 서버에서 받은 상태 메시지를 괄호 안에 표시 */}
                    {isCurrent && currentStatus && (
                      <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>
                        — {currentStatus}
                      </span>
                    )}
                  </StatusMessage>
                </StatusItem>
              );
            })}
          </StatusList>
        </StatusSection>
      )}

      {/* ── 공통 특성 배지 — shared_features 이벤트 수신 후 표시 ── */}
      {sharedFeatures && (
        <SharedFeaturesBadge sharedFeatures={sharedFeatures} />
      )}

      {/* ── 추천 결과 카드 목록 — match_result 이벤트 수신 후 표시 ── */}
      {matchResults.length > 0 && (
        <ResultsSection aria-label="추천 결과">
          <ResultsHeader>
            <ResultsTitle>추천 영화 {matchResults.length}편</ResultsTitle>
          </ResultsHeader>
          <ResultsGrid>
            {matchResults.map((movie) => (
              <MatchResultCard
                /* movie_id 또는 title+rank 조합으로 고유 key 보장 */
                key={movie.movie_id || `match-${movie.rank}-${movie.title}`}
                movie={movie}
                movie1Title={selectedMovie1?.title || '영화 A'}
                movie2Title={selectedMovie2?.title || '영화 B'}
              />
            ))}
          </ResultsGrid>

          {/* 결과 하단 — 다시 검색 버튼 */}
          <ButtonArea>
            <MatchButton
              onClick={reset}
              $active
              aria-label="처음부터 다시 검색"
              style={{ fontSize: 'var(--text-base)', padding: 'var(--space-sm) var(--space-xl)' }}
            >
              &#8635; 다시 검색
            </MatchButton>
          </ButtonArea>
        </ResultsSection>
      )}
    </PageContainer>
  );
}
