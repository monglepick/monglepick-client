/**
 * 로딩 스피너 컴포넌트.
 *
 * 데이터 로딩 중 화면에 표시하는 스피너 애니메이션.
 * 전체 페이지 로딩(fullPage)과 인라인 로딩을 지원한다.
 *
 * @param {Object} props
 * @param {string} [props.message='로딩 중...'] - 스피너 아래 표시할 메시지
 * @param {boolean} [props.fullPage=false] - 전체 페이지 중앙 정렬 여부
 * @param {string} [props.size='md'] - 스피너 크기 (sm, md, lg)
 */

import * as S from './Loading.styled';

export default function Loading({ message = '로딩 중...', fullPage = false, size = 'md' }) {
  return (
    <S.Wrapper $fullPage={fullPage}>
      {/* 스피너 원형 애니메이션 */}
      <S.Spinner $size={size}>
        <S.SpinnerRing $size={size} />
      </S.Spinner>

      {/* 로딩 메시지 */}
      {message && <S.Message>{message}</S.Message>}
    </S.Wrapper>
  );
}
