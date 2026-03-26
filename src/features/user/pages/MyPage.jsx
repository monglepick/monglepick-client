/**
 * 마이페이지 컴포넌트.
 *
 * 로그인한 사용자의 개인 정보를 관리하는 페이지.
 * 탭으로 구분된 다음 섹션을 포함한다:
 * - 프로필: 사용자 기본 정보 (닉네임, 이메일)
 * - 시청 이력: 시청한 영화 목록
 * - 위시리스트: 찜한 영화 목록
 * - 선호 설정: 선호 장르/분위기 설정
 *
 * 개선 사항:
 * - 프로필 카드 glassmorphism 효과
 * - 아바타 그라데이션 테두리 (80px)
 * - 등급 배지 표시
 * - 탭 전환 시 fade-in 애니메이션
 * - 빈 시청이력/위시리스트에 EmptyState 컴포넌트
 * - 프로필 편집 버튼 (UI만)
 *
 * 비인증 상태에서 접근 시 로그인 페이지로 리다이렉트한다.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
/* 인증 Context 훅 — app/providers에서 가져옴 */
import useAuthStore from '../../../shared/stores/useAuthStore';
/* 마이페이지 API — 같은 feature 내의 userApi에서 가져옴 */
import { getProfile, getWatchHistory, getWishlist } from '../api/userApi';
/* 라우트 경로 상수 — shared/constants에서 가져옴 */
import { ROUTES } from '../../../shared/constants/routes';
/* 영화 목록 컴포넌트 — shared/components에서 가져옴 */
import MovieList from '../../../shared/components/MovieList/MovieList';
/* 로딩 스피너 — shared/components에서 가져옴 */
import Loading from '../../../shared/components/Loading/Loading';
/* 빈 상태 컴포넌트 — shared/components에서 가져옴 */
import EmptyState from '../../../shared/components/EmptyState/EmptyState';
import * as S from './MyPage.styled';

/** 탭 정의 */
const TABS = [
  { id: 'profile', label: '프로필' },
  { id: 'history', label: '시청 이력' },
  { id: 'wishlist', label: '위시리스트' },
  { id: 'preferences', label: '선호 설정' },
];

export default function MyPagePage() {
  // 현재 활성 탭
  const [activeTab, setActiveTab] = useState('profile');
  // 프로필 정보
  const [profile, setProfile] = useState(null);
  // 시청 이력
  const [watchHistory, setWatchHistory] = useState([]);
  // 위시리스트
  const [wishlist, setWishlist] = useState([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  // 에러 메시지
  const [error, setError] = useState(null);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  /* PrivateRoute가 비인증 리다이렉트를 처리하므로 여기서는 생략 */

  /**
   * 탭 전환 시 해당 데이터를 로드한다.
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadTabData() {
      setIsLoading(true);
      setError(null);
      try {
        switch (activeTab) {
          case 'profile': {
            const profileData = await getProfile();
            setProfile(profileData);
            break;
          }
          case 'history': {
            const historyData = await getWatchHistory();
            setWatchHistory(historyData?.watchHistory || []);
            break;
          }
          case 'wishlist': {
            const wishlistData = await getWishlist();
            setWishlist(wishlistData?.wishlist || []);
            break;
          }
          default:
            break;
        }
      } catch (err) {
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTabData();
  }, [activeTab, isAuthenticated]);

  // 인증 로딩 중
  if (authLoading) {
    return <Loading message="인증 확인 중..." fullPage />;
  }

  return (
    <S.Wrapper>
      <S.Inner>
        {/* 페이지 헤더 — 프로필 카드 (glassmorphism) */}
        <S.Header>
          {/* 아바타 — 그라데이션 테두리 */}
          <S.AvatarWrap>
            <S.Avatar>
              {user?.nickname?.charAt(0) || 'U'}
            </S.Avatar>
          </S.AvatarWrap>
          <S.UserInfo>
            <S.NameRow>
              <S.Nickname>{user?.nickname || '사용자'}</S.Nickname>
              {/* 등급 배지 */}
              <S.GradeBadge>{profile?.grade || user?.grade || 'BRONZE'}</S.GradeBadge>
            </S.NameRow>
            <S.Email>{user?.email || ''}</S.Email>
            {/* 프로필 편집 버튼 (UI만) */}
            <S.EditBtn>
              ✏️ 프로필 수정
            </S.EditBtn>
          </S.UserInfo>
        </S.Header>

        {/* 탭 네비게이션 — 그라데이션 하단 바 */}
        <S.Tabs role="tablist" aria-label="마이페이지 탭">
          {TABS.map((tab) => (
            <S.Tab
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`mypage-panel-${tab.id}`}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </S.Tab>
          ))}
        </S.Tabs>

        {/* 에러 메시지 */}
        {error && (
          <S.ErrorBar role="alert">
            {error}
            <S.ErrorClose onClick={() => setError(null)}>닫기</S.ErrorClose>
          </S.ErrorBar>
        )}

        {/* 탭 콘텐츠 — fadeInUp 애니메이션 */}
        <S.Content key={activeTab}>
          {/* 프로필 탭 */}
          {activeTab === 'profile' && (
            <div>
              {isLoading ? (
                <Loading message="프로필 로딩 중..." />
              ) : (
                <S.ProfileCard>
                  <S.ProfileField>
                    <S.ProfileLabel>닉네임</S.ProfileLabel>
                    <S.ProfileValue>
                      {profile?.nickname || user?.nickname || '-'}
                    </S.ProfileValue>
                  </S.ProfileField>
                  <S.ProfileField>
                    <S.ProfileLabel>이메일</S.ProfileLabel>
                    <S.ProfileValue>
                      {profile?.email || user?.email || '-'}
                    </S.ProfileValue>
                  </S.ProfileField>
                  <S.ProfileField>
                    <S.ProfileLabel>가입일</S.ProfileLabel>
                    <S.ProfileValue>
                      {profile?.createdAt || '-'}
                    </S.ProfileValue>
                  </S.ProfileField>
                </S.ProfileCard>
              )}
            </div>
          )}

          {/* 시청 이력 탭 */}
          {activeTab === 'history' && (
            <div>
              {!isLoading && watchHistory.length === 0 ? (
                <EmptyState
                  icon="🎬"
                  title="시청 이력이 없습니다"
                  description="영화를 시청하면 여기에 기록됩니다"
                  actionLabel="영화 검색하기"
                  onAction={() => navigate(ROUTES.SEARCH)}
                />
              ) : (
                <MovieList
                  movies={watchHistory.map((item) => item.movie || item)}
                  loading={isLoading}
                  title="시청한 영화"
                />
              )}
            </div>
          )}

          {/* 위시리스트 탭 */}
          {activeTab === 'wishlist' && (
            <div>
              {!isLoading && wishlist.length === 0 ? (
                <EmptyState
                  icon="💝"
                  title="위시리스트가 비어있습니다"
                  description="마음에 드는 영화를 찜해보세요"
                  actionLabel="영화 둘러보기"
                  onAction={() => navigate(ROUTES.SEARCH)}
                />
              ) : (
                <MovieList
                  movies={wishlist.map((item) => item.movie || item)}
                  loading={isLoading}
                  title="찜한 영화"
                />
              )}
            </div>
          )}

          {/* 선호 설정 탭 */}
          {activeTab === 'preferences' && (
            <div>
              <S.PreferencesCard>
                <S.PreferencesTitle>선호 장르</S.PreferencesTitle>
                <S.PreferencesHint>
                  좋아하는 장르를 선택하면 더 정확한 추천을 받을 수 있습니다.
                  <br />
                  <span style={{ fontSize: '0.85em' }}>이 기능은 준비 중입니다.</span>
                </S.PreferencesHint>
                <S.PreferencesTags>
                  {['액션', '코미디', '드라마', '로맨스', 'SF', '스릴러', '공포', '애니메이션', '판타지', '범죄', '다큐멘터리', '가족'].map(
                    (genre) => (
                      <S.PreferencesTag key={genre} disabled title="준비 중">
                        {genre}
                      </S.PreferencesTag>
                    ),
                  )}
                </S.PreferencesTags>
              </S.PreferencesCard>
            </div>
          )}
        </S.Content>
      </S.Inner>
    </S.Wrapper>
  );
}
