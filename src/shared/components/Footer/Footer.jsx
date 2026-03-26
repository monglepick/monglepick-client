/**
 * 푸터 컴포넌트.
 *
 * 앱 하단에 3컬럼 구조로 정보를 표시한다:
 * - 좌: 로고 + 서비스 설명
 * - 중: 퀵 링크 (홈, 검색, 커뮤니티, 고객센터)
 * - 우: 팀 정보 (몽글픽 팀, 이메일)
 * - 하단: 구분선 + 저작권
 * 모바일에서는 1컬럼 스택으로 전환된다.
 */

/* 라우트 경로 상수 — shared/constants에서 가져옴 */
import { ROUTES } from '../../constants/routes';
import * as S from './Footer.styled';

export default function Footer() {
  // 현재 연도 — 저작권 표시에 사용
  const currentYear = new Date().getFullYear();

  return (
    <S.FooterWrapper>
      <S.Inner>
        {/* ── 3컬럼 콘텐츠 영역 ── */}
        <S.Columns>
          {/* 좌측 — 로고 및 서비스 설명 */}
          <S.Brand>
            <S.LogoLink to={ROUTES.HOME}>
              <S.LogoIcon src="/mongle-transparent.png" alt="몽글픽" />
              <S.LogoText>몽글픽</S.LogoText>
            </S.LogoLink>
            <S.Desc>
              AI가 당신의 취향을 분석하여
            </S.Desc>
            <S.Desc>
              딱 맞는 영화를 추천해 드립니다.
            </S.Desc>
          </S.Brand>

          {/* 중앙 — 퀵 링크 */}
          <S.Nav>
            <S.NavTitle>바로가기</S.NavTitle>
            <S.NavLink to={ROUTES.HOME}>홈</S.NavLink>
            <S.NavLink to={ROUTES.SEARCH}>검색</S.NavLink>
            <S.NavLink to={ROUTES.COMMUNITY}>커뮤니티</S.NavLink>
            <S.NavLink to={ROUTES.SUPPORT}>고객센터</S.NavLink>
          </S.Nav>

          {/* 우측 — 팀 정보 */}
          <S.Team>
            <S.NavTitle>팀 정보</S.NavTitle>
            <S.TeamName>몽글픽 팀</S.TeamName>
            <S.TeamEmail>contact@monglepick.com</S.TeamEmail>
          </S.Team>
        </S.Columns>

        {/* ── 구분선 ── */}
        <S.Divider />

        {/* ── 저작권 ── */}
        <S.Copyright>
          <p>&copy; {currentYear} 몽글픽. All rights reserved.</p>
        </S.Copyright>
      </S.Inner>
    </S.FooterWrapper>
  );
}
