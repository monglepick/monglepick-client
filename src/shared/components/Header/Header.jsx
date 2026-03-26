/**
 * 네비게이션 헤더 컴포넌트.
 *
 * 앱 상단에 고정되어 로고, 네비게이션 링크, 인증 버튼을 표시한다.
 * 다크 테마에 맞춘 반투명 배경으로 세련된 느낌을 제공한다.
 * 모바일 환경에서는 햄버거 메뉴로 전환된다.
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
/* 인증 Context 훅 — app/providers에서 가져옴 */
import useAuthStore from '../../stores/useAuthStore';
/* 라우트 경로 상수 — shared/constants에서 가져옴 */
import { ROUTES, NAV_ITEMS } from '../../constants/routes';
import * as S from './Header.styled';

export default function Header() {
  // 현재 경로 — 활성 메뉴 하이라이트에 사용
  const location = useLocation();
  // 인증 상태 및 액션
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  // 모바일 메뉴 열림/닫힘 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 모바일 메뉴 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  /**
   * 모바일 메뉴 토글 핸들러.
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  /**
   * 메뉴 항목 클릭 시 모바일 메뉴 닫기.
   */
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  /**
   * 로그아웃 버튼 클릭 핸들러.
   */
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate(ROUTES.LANDING);
  };

  return (
    <S.HeaderWrapper>
      <S.Inner>
        {/* ── 로고 영역 ── */}
        <S.LogoLink to={ROUTES.HOME} onClick={closeMobileMenu}>
          <S.LogoIcon src="/mongle-transparent.png" alt="몽글픽" />
          <S.LogoText>몽글픽</S.LogoText>
        </S.LogoLink>

        {/* ── 네비게이션 링크 (데스크톱) ── */}
        <S.Nav $isOpen={isMobileMenuOpen}>
          {NAV_ITEMS.map((item) => (
            <S.NavLink
              key={item.path}
              to={item.path}
              $active={location.pathname === item.path}
              onClick={closeMobileMenu}
            >
              {item.label}
            </S.NavLink>
          ))}

          {/* ── 인증 버튼 (모바일 메뉴 내부) ── */}
          <S.AuthSection $mobile>
            {isAuthenticated ? (
              <>
                <S.NavLink
                  to={ROUTES.MYPAGE}
                  onClick={closeMobileMenu}
                >
                  마이페이지
                </S.NavLink>
                <S.LogoutBtn onClick={handleLogout}>
                  로그아웃
                </S.LogoutBtn>
              </>
            ) : (
              <>
                <S.AuthBtn to={ROUTES.LOGIN} onClick={closeMobileMenu}>
                  로그인
                </S.AuthBtn>
                <S.SignupBtn to={ROUTES.SIGNUP} onClick={closeMobileMenu}>
                  회원가입
                </S.SignupBtn>
              </>
            )}
          </S.AuthSection>
        </S.Nav>

        {/* ── 인증 버튼 (데스크톱) ── */}
        <S.AuthSection $desktop>
          {isAuthenticated ? (
            <>
              <S.UserInfo to={ROUTES.MYPAGE}>
                <S.UserAvatar>
                  {user?.nickname?.charAt(0) || 'U'}
                </S.UserAvatar>
                <S.UserName>{user?.nickname || '사용자'}</S.UserName>
              </S.UserInfo>
              <S.LogoutBtn onClick={handleLogout}>
                로그아웃
              </S.LogoutBtn>
            </>
          ) : (
            <>
              <S.AuthBtn to={ROUTES.LOGIN}>
                로그인
              </S.AuthBtn>
              <S.SignupBtn to={ROUTES.SIGNUP}>
                회원가입
              </S.SignupBtn>
            </>
          )}
        </S.AuthSection>

        {/* ── 모바일 햄버거 메뉴 버튼 ── */}
        <S.MobileToggle
          $isOpen={isMobileMenuOpen}
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기/닫기"
        >
          <span></span>
          <span></span>
          <span></span>
        </S.MobileToggle>
      </S.Inner>
    </S.HeaderWrapper>
  );
}
