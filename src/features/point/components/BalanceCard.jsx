/**
 * 포인트 잔액 요약 카드 컴포넌트.
 *
 * 보유 포인트, 등급 배지, 총 획득 포인트, 충전 버튼을 표시한다.
 *
 * @param {Object} props
 * @param {Object|null} props.balanceInfo - 잔액 정보 {balance, grade, totalEarned}
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {Function} props.onNavigatePayment - 충전 버튼 클릭 핸들러
 * @param {Function} props.formatNumber - 숫자 포맷팅 함수
 */

import Loading from '../../../shared/components/Loading/Loading';
import * as S from './BalanceCard.styled';

/** 등급별 표시 라벨 */
const GRADE_LABELS = {
  BRONZE:   'Bronze',
  SILVER:   'Silver',
  GOLD:     'Gold',
  PLATINUM: 'Platinum',
};

export default function BalanceCard({
  balanceInfo,
  isLoading,
  onNavigatePayment,
  formatNumber,
}) {
  /* 등급 키 — 없으면 BRONZE 기본값 */
  const gradeKey = balanceInfo?.grade || 'BRONZE';

  return (
    /* SummarySection은 point-page__section + point-page__summary 역할을 겸함 */
    <S.SummarySection className="point-page__section">
      {isLoading ? (
        <Loading message="포인트 정보 로딩 중..." />
      ) : (
        <S.SummaryCard>
          {/* 좌측: 잔액 정보 */}
          <S.SummaryLeft>
            <S.SummaryLabel>보유 포인트</S.SummaryLabel>
            <S.SummaryBalance>
              {formatNumber(balanceInfo?.balance)}
              <S.SummaryUnit>P</S.SummaryUnit>
            </S.SummaryBalance>
            <S.SummaryEarned>
              총 획득: {formatNumber(balanceInfo?.totalEarned)}P
            </S.SummaryEarned>
          </S.SummaryLeft>

          {/* 우측: 등급 배지 + 충전 버튼 */}
          <S.SummaryRight>
            {/* $grade prop으로 등급별 색상 적용 (인라인 스타일 제거) */}
            <S.GradeBadge $grade={gradeKey}>
              {GRADE_LABELS[gradeKey] || gradeKey}
            </S.GradeBadge>
            <S.ChargeButton onClick={onNavigatePayment}>
              충전하기
            </S.ChargeButton>
          </S.SummaryRight>
        </S.SummaryCard>
      )}
    </S.SummarySection>
  );
}
