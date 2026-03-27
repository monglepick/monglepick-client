/**
 * 서비스별 Base URL 설정
 *
 * - 개발 환경: 각 서비스가 개별 포트에서 실행 (8080, 8000, 8001)
 * - 운영 환경(Nginx): 모든 URL이 빈 문자열 → 상대 경로 → 리버스 프록시가 라우팅
 *
 * .env 예시:
 *   VITE_BACKEND_URL=http://localhost:8080
 *   VITE_AGENT_URL=http://localhost:8000
 *   VITE_RECOMMEND_URL=http://localhost:8001
 */
export const SERVICE_URLS = {
  /** Spring Boot Backend — 인증, 포인트, 결제, 영화, 커뮤니티, 마이페이지 */
  BACKEND: import.meta.env.VITE_BACKEND_URL || '',

  /** FastAPI AI Agent — 채팅 SSE, Movie Match SSE */
  AGENT: import.meta.env.VITE_AGENT_URL || '',

  /** FastAPI Recommend — 검색, 온보딩 */
  RECOMMEND: import.meta.env.VITE_RECOMMEND_URL || '',
};
