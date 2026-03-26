/**
 * Movie Match SSE 스트리밍 API 레이어.
 *
 * AI Agent POST /api/v1/match 엔드포인트에 fetch 요청을 보내고,
 * ReadableStream으로 SSE 이벤트를 실시간 파싱하여 콜백으로 전달한다.
 *
 * SSE 이벤트 타입 (5종):
 * - status:          처리 단계 상태 메시지 ({phase, message})
 * - shared_features: 두 영화의 공통 특성 분석 결과 ({common_genres, common_moods, similarity_summary, ...})
 * - match_result:    추천 영화 목록 ({movies: [{movie_id, title, genres, rating, poster_path, score_detail, explanation, rank}, ...]})
 * - error:           에러 메시지 ({error_code, message})
 * - done:            완료 신호 ({})
 *
 * chatApi.js 패턴을 그대로 따른다:
 * - fetch + ReadableStream + TextDecoder
 * - \n\n 기준 SSE 블록 분리
 * - JWT Authorization 헤더 선택적 주입
 * - AbortController를 통한 스트림 취소 지원
 */

/* localStorage 래퍼 유틸 — 인증 토큰 안전 접근 */
import { getToken } from '../../../shared/utils/storage';
/* MATCH API 엔드포인트 상수 */
import { MATCH_ENDPOINTS } from '../../../shared/constants/api';

/**
 * Movie Match SSE 스트리밍 요청을 보내고 이벤트를 콜백으로 전달한다.
 *
 * @param {Object} params - 요청 파라미터
 * @param {string} params.movieId1 - 첫 번째 영화 ID (예: 'tmdb_550')
 * @param {string} params.movieId2 - 두 번째 영화 ID (예: 'tmdb_680')
 * @param {string} [params.userId=''] - 사용자 ID (빈 문자열이면 익명)
 * @param {Object} callbacks - SSE 이벤트 콜백 함수 객체
 * @param {function} [callbacks.onStatus] - status 이벤트 핸들러 ({phase, message})
 * @param {function} [callbacks.onSharedFeatures] - shared_features 이벤트 핸들러 ({common_genres, common_moods, ...})
 * @param {function} [callbacks.onMatchResult] - match_result 이벤트 핸들러 ({movies: [...]})
 * @param {function} [callbacks.onError] - error 이벤트 핸들러 ({error_code, message})
 * @param {function} [callbacks.onDone] - done 이벤트 핸들러 ({})
 * @param {AbortSignal} [signal] - 요청 취소용 AbortSignal (AbortController.signal)
 * @returns {Promise<void>}
 * @throws {Error} HTTP 에러 또는 네트워크 에러 발생 시
 */
export async function sendMatchRequest(
  { movieId1, movieId2, userId = '' },
  { onStatus, onSharedFeatures, onMatchResult, onError, onDone } = {},
  signal,
) {
  // JWT 토큰 조회 — storage 래퍼를 통해 안전하게 접근
  // Match 기능은 인증 없이도 사용 가능하며, 토큰이 있으면 선택적으로 주입
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Agent(:8000)으로 POST 요청 전송
  // Vite 프록시 설정에서 /api/* → :8000(AI Agent)으로 전달됨
  const response = await fetch(MATCH_ENDPOINTS.STREAM, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      // Agent API 명세: snake_case 필드
      movie_id_1: movieId1,
      movie_id_2: movieId2,
      user_id: userId || undefined, // 빈 문자열이면 필드 자체를 생략
    }),
    signal,
  });

  // HTTP 에러 처리 — 응답 본문에서 에러 메시지 추출
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  // ReadableStream으로 SSE 이벤트 파싱
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  // 불완전한 청크를 누적하는 버퍼
  let buffer = '';

  // 개발 환경에서만 SSE 디버그 로그 출력 (프로덕션에서 민감 데이터 노출 방지)
  if (import.meta.env.DEV) {
    console.log('[Match SSE] 스트림 시작, Content-Type:', response.headers.get('content-type'));
  }

  try {
    while (true) {
      const { done, value } = await reader.read();

      // 스트림이 완전히 종료되었으면 루프 탈출
      if (done) {
        if (import.meta.env.DEV) {
          console.log('[Match SSE] 스트림 종료 (done=true)');
        }
        break;
      }

      // 수신된 청크를 버퍼에 추가
      // sse_starlette는 \r\n을 사용할 수 있으므로 LF로 정규화
      const chunk = decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
      buffer += chunk;

      if (import.meta.env.DEV) {
        console.log('[Match SSE] 청크 수신:', chunk.length, '바이트, 내용:', chunk.substring(0, 200));
      }

      // 완성된 SSE 이벤트 블록(\n\n으로 구분) 추출 및 처리
      const blocks = buffer.split('\n\n');
      // 마지막 블록은 아직 불완전할 수 있으므로 버퍼에 보관
      buffer = blocks.pop() || '';

      for (const block of blocks) {
        if (!block.trim()) continue;
        parseMatchSSEBlock(block, { onStatus, onSharedFeatures, onMatchResult, onError, onDone });
      }
    }

    // 스트림 종료 후 잔여 버퍼 처리 (마지막 블록이 \n\n 없이 끝난 경우)
    if (buffer.trim()) {
      if (import.meta.env.DEV) {
        console.log('[Match SSE] 잔여 버퍼 처리:', buffer.substring(0, 200));
      }
      parseMatchSSEBlock(buffer, { onStatus, onSharedFeatures, onMatchResult, onError, onDone });
    }
  } finally {
    // 예외 발생 시에도 reader를 반드시 해제하여 스트림 리소스 누수 방지
    reader.cancel().catch(() => {});
  }
}

/**
 * SSE 이벤트 블록 1개를 파싱하여 적절한 콜백을 호출한다.
 *
 * SSE 표준 형식:
 *   event: {eventType}
 *   data: {jsonPayload}
 *
 * sse-starlette 래핑 형식도 지원:
 *   data: {jsonPayload}  (event 없이 data만 있는 경우)
 *
 * @param {string} block - SSE 이벤트 블록 문자열 (줄바꿈으로 구분된 라인들)
 * @param {Object} callbacks - 이벤트 콜백 객체
 */
function parseMatchSSEBlock(block, callbacks) {
  const lines = block.split('\n');
  let eventType = null;
  let dataStr = '';

  for (const line of lines) {
    // "event: xxx" 라인에서 이벤트 타입 추출
    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim();
    }
    // "data: xxx" 라인에서 JSON 데이터 추출
    else if (line.startsWith('data:')) {
      dataStr += line.slice(5).trim();
    }
    // SSE 주석(: 으로 시작) 또는 빈 줄은 무시
  }

  // 데이터가 없으면 무시 (keep-alive ping 등)
  if (!dataStr) return;

  // JSON 파싱
  let data;
  try {
    data = JSON.parse(dataStr);
  } catch {
    // JSON 파싱 실패 시 무시 (keep-alive ping 또는 텍스트 형식)
    return;
  }

  // sse-starlette 래핑 형식 처리:
  // sse-starlette가 yield된 문자열을 data 필드로 감싸는 경우,
  // data 내부에 다시 "event: xxx\ndata: yyy" 형태가 올 수 있음
  if (typeof data === 'string' && data.includes('event:')) {
    parseMatchSSEBlock(data, callbacks);
    return;
  }

  // 이벤트 타입별 콜백 호출
  dispatchMatchEvent(eventType, data, callbacks);
}

/**
 * 파싱된 SSE 이벤트를 적절한 콜백으로 디스패치한다.
 *
 * Match 이벤트 타입 (5종):
 * - status:          진행 상태 업데이트
 * - shared_features: 두 영화의 공통 특성 분석 결과
 * - match_result:    추천 영화 목록 (최대 5편)
 * - error:           에러 메시지
 * - done:            완료 신호
 *
 * @param {string|null} eventType - 이벤트 타입
 * @param {Object} data - 파싱된 JSON 데이터
 * @param {Object} callbacks - 콜백 함수 객체
 */
function dispatchMatchEvent(eventType, data, callbacks) {
  if (import.meta.env.DEV) {
    console.log('[Match SSE] 이벤트 디스패치:', eventType, data);
  }

  const { onStatus, onSharedFeatures, onMatchResult, onError, onDone } = callbacks;

  switch (eventType) {
    // 처리 단계 상태 메시지 (phase, message)
    case 'status':
      onStatus?.(data);
      break;

    // 두 영화의 공통 특성 분석 결과 (공통 장르, 무드, 유사도 요약 등)
    case 'shared_features':
      onSharedFeatures?.(data);
      break;

    // 추천 영화 목록 — 최대 5편, score_detail 포함
    case 'match_result':
      onMatchResult?.(data);
      break;

    // 에러 메시지
    case 'error':
      onError?.(data);
      break;

    // 완료 신호 — SSE 스트림 정상 종료
    case 'done':
      onDone?.(data);
      break;

    default:
      // 알 수 없는 이벤트 타입은 조용히 무시
      if (import.meta.env.DEV) {
        console.warn('[Match SSE] 알 수 없는 이벤트 타입:', eventType, data);
      }
      break;
  }
}
