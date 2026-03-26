/**
 * 현재 구독 상태 표시 컴포넌트.
 *
 * 활성 구독이 있으면 구독 정보(상품명, 상태, 시작일, 만료일)와 취소 버튼을 표시한다.
 * 구독이 없으면 구독 유도 메시지를 표시한다.
 *
 * @param {Object} props
 * @param {Object|null} props.subscriptionStatus - 구독 상태 데이터
 * @param {boolean} props.hasActiveSubscription - 활성 구독 존재 여부
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {boolean} props.isCancelling - 취소 처리 중 여부
 * @param {Function} props.onCancel - 구독 취소 핸들러
 * @param {Function} props.formatDate - 날짜 포맷팅 함수
 */

import Loading from '../../../shared/components/Loading/Loading';
import * as S from './SubscriptionStatus.styled';

export default function SubscriptionStatus({
  subscriptionStatus,
  hasActiveSubscription,
  isLoading,
  isCancelling,
  onCancel,
  formatDate,
}) {
  if (isLoading) {
    return <Loading message="구독 상태 확인 중..." />;
  }

  /* 구독 없음 */
  if (!hasActiveSubscription) {
    return (
      <S.EmptyWrapper>
        <S.EmptyText>
          현재 활성화된 구독이 없습니다.
        </S.EmptyText>
        <S.EmptyHint>
          위 구독 상품을 선택하여 더 많은 혜택을 받아보세요!
        </S.EmptyHint>
      </S.EmptyWrapper>
    );
  }

  /* 활성 구독 정보 표시 */
  return (
    <S.Card>
      {/* 구독 정보 */}
      <S.InfoList>
        <S.Field>
          <S.Label>구독 상품</S.Label>
          <S.Value>
            {subscriptionStatus?.planName || '-'}
          </S.Value>
        </S.Field>
        <S.Field>
          <S.Label>상태</S.Label>
          {/* $status prop으로 상태별 색상 적용 (인라인 스타일 제거) */}
          <S.Value $status={subscriptionStatus?.status}>
            {subscriptionStatus?.status === 'ACTIVE'
              ? '구독 중'
              : subscriptionStatus?.status === 'CANCELLED'
                ? '취소됨 (만료일까지 이용 가능)'
                : subscriptionStatus?.status || '-'}
          </S.Value>
        </S.Field>
        <S.Field>
          <S.Label>시작일</S.Label>
          <S.Value>
            {formatDate(subscriptionStatus?.startedAt || subscriptionStatus?.startDate)}
          </S.Value>
        </S.Field>
        <S.Field>
          <S.Label>만료일</S.Label>
          <S.Value>
            {formatDate(subscriptionStatus?.expiresAt || subscriptionStatus?.endDate)}
          </S.Value>
        </S.Field>
      </S.InfoList>

      {/* 구독 취소 버튼 — ACTIVE 상태에서만 표시 */}
      {subscriptionStatus?.status === 'ACTIVE' && (
        <S.CancelButton
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? '취소 처리 중...' : '구독 취소'}
        </S.CancelButton>
      )}
    </S.Card>
  );
}
