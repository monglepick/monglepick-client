/**
 * 404 Not Found 페이지 컴포넌트.
 *
 * 존재하지 않는 URL에 접근했을 때 표시되는 에러 페이지.
 * App.jsx의 catch-all 라우트(<Route path="*">)에서 렌더링된다.
 *
 * - 404 숫자 fade-in + scale 애니메이션
 * - 배경에 떠다니는 필름 프레임 이모지 (CSS float 애니메이션)
 * - "영화 검색" 링크 추가
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/routes';
import * as S from './NotFoundPage.styled';

export default function NotFoundPage() {
  return (
    <S.Wrapper>
      {/* 배경 떠다니는 이모지 장식 — $index prop으로 위치/animation 결정 */}
      <S.FloatEmoji $index={1} aria-hidden="true">🎬</S.FloatEmoji>
      <S.FloatEmoji $index={2} aria-hidden="true">🎞️</S.FloatEmoji>
      <S.FloatEmoji $index={3} aria-hidden="true">🍿</S.FloatEmoji>
      <S.FloatEmoji $index={4} aria-hidden="true">🎭</S.FloatEmoji>

      <S.Inner>
        {/* 404 코드 — gradient-text + gradientShift + fadeInScale */}
        <S.Code>404</S.Code>

        {/* 안내 메시지 */}
        <S.Message>요청하신 페이지를 찾을 수 없습니다.</S.Message>
        <S.Description>
          주소가 잘못되었거나, 더 이상 존재하지 않는 페이지입니다.
        </S.Description>

        {/* 액션 링크들 */}
        <S.Actions>
          {/* 홈으로 이동 — as={Link}로 react-router-dom 라우팅 유지 */}
          <S.HomeLink as={Link} to={ROUTES.HOME}>
            홈으로 돌아가기
          </S.HomeLink>
          {/* 영화 검색 링크 */}
          <S.SearchLink as={Link} to={ROUTES.SEARCH}>
            🔍 영화 검색
          </S.SearchLink>
        </S.Actions>
      </S.Inner>
    </S.Wrapper>
  );
}
