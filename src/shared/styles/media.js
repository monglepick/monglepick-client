/**
 * 미디어쿼리 헬퍼.
 *
 * 프로젝트에서 사용하는 브레이크포인트를 상수화하여
 * styled-components 내부에서 일관되게 사용한다.
 *
 * 사용 예시:
 *   import { media } from '../../../shared/styles/media';
 *   const Nav = styled.nav`
 *     display: flex;
 *     ${media.tablet} { display: none; }
 *     ${media.mobile} { padding: 8px; }
 *   `;
 */

/** 브레이크포인트 값 (px) */
export const breakpoints = {
  mobile: 480,
  tablet: 768,
};

/** 미디어쿼리 문자열 — tagged template literal 내부에서 보간 가능 */
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
  tablet: `@media (max-width: ${breakpoints.tablet}px)`,
};
