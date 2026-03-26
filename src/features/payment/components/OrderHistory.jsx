/**
 * 결제 내역 테이블 + 페이지네이션 컴포넌트.
 *
 * 과거 결제 주문 목록을 테이블 형태로 표시하며,
 * Spring Page 응답 기반 페이지네이션을 제공한다.
 *
 * @param {Object} props
 * @param {Object} props.orders - 주문 페이지 데이터 ({ content: [], totalPages, totalElements })
 * @param {number} props.orderPage - 현재 페이지 번호 (0-indexed)
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {Function} props.onPageChange - 페이지 변경 핸들러 (setter 함수)
 * @param {Function} props.formatNumber - 숫자 포맷팅 함수
 * @param {Function} props.formatDate - 날짜 포맷팅 함수
 */

import Loading from '../../../shared/components/Loading/Loading';
import * as S from './OrderHistory.styled';

/** 주문 상태별 표시 라벨 (색상은 styled-components $status prop으로 처리) */
const ORDER_STATUS_CONFIG = {
  PENDING:   { label: '대기 중' },
  COMPLETED: { label: '완료' },
  FAILED:    { label: '실패' },
  REFUNDED:  { label: '환불' },
  CANCELLED: { label: '취소' },
};

/** 주문 유형별 표시 라벨 */
const ORDER_TYPE_LABELS = {
  POINT_CHARGE:   '포인트 충전',
  POINT_PURCHASE: '포인트 충전',
  SUBSCRIPTION:   '구독 결제',
};

export default function OrderHistory({
  orders,
  orderPage,
  isLoading,
  onPageChange,
  formatNumber,
  formatDate,
}) {
  if (isLoading) {
    return <Loading message="결제 내역 로딩 중..." />;
  }

  if (orders.content.length === 0) {
    return (
      <S.EmptyWrapper>
        <p>결제 내역이 없습니다.</p>
      </S.EmptyWrapper>
    );
  }

  return (
    <>
      {/* 결제 내역 테이블 */}
      <S.TableWrapper>
        <S.Table>
          <thead>
            <tr>
              <S.Th>주문번호</S.Th>
              <S.Th>유형</S.Th>
              <S.Th>금액</S.Th>
              <S.Th>상태</S.Th>
              <S.Th>일시</S.Th>
            </tr>
          </thead>
          <tbody>
            {orders.content.map((order, idx) => {
              const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
                label: order.status,
              };

              return (
                <S.Tr key={order.orderId || idx}>
                  {/* 주문번호 — 고정폭 폰트 */}
                  <S.OrderIdCell>
                    {order.orderId
                      ? `${order.orderId.slice(0, 8)}...`
                      : '-'}
                  </S.OrderIdCell>
                  <S.Td>
                    {ORDER_TYPE_LABELS[order.orderType] || order.orderType || '-'}
                  </S.Td>
                  {/* 금액 */}
                  <S.AmountCell>
                    {formatNumber(order.amount)}원
                  </S.AmountCell>
                  <S.Td>
                    {/* $status prop으로 상태별 색상 적용 (인라인 스타일 제거) */}
                    <S.StatusBadge $status={order.status}>
                      {statusConfig.label}
                    </S.StatusBadge>
                  </S.Td>
                  {/* 일시 */}
                  <S.DateCell>
                    {formatDate(order.completedAt || order.createdAt)}
                  </S.DateCell>
                </S.Tr>
              );
            })}
          </tbody>
        </S.Table>
      </S.TableWrapper>

      {/* 페이지네이션 */}
      {orders.totalPages > 1 && (
        <S.Pagination>
          <S.PaginationButton
            onClick={() => onPageChange((prev) => Math.max(0, prev - 1))}
            disabled={orderPage === 0}
          >
            이전
          </S.PaginationButton>
          <S.PaginationInfo>
            {orderPage + 1} / {orders.totalPages}
          </S.PaginationInfo>
          <S.PaginationButton
            onClick={() =>
              onPageChange((prev) => Math.min(orders.totalPages - 1, prev + 1))
            }
            disabled={orderPage >= orders.totalPages - 1}
          >
            다음
          </S.PaginationButton>
        </S.Pagination>
      )}
    </>
  );
}
