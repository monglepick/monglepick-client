/**
 * 포인트 팩 구매 섹션 컴포넌트.
 *
 * 일회성 포인트 충전 상품 목록을 카드 그리드로 표시한다.
 * 각 카드에 포인트 수량, 보너스, 가격, 구매 버튼을 포함한다.
 *
 * @param {Object} props
 * @param {Array} props.packs - 포인트 팩 상품 배열
 * @param {string|null} props.processingId - 현재 결제 처리 중인 팩 ID
 * @param {Function} props.onBuyPack - 구매 버튼 클릭 핸들러
 * @param {Function} props.formatNumber - 숫자 포맷팅 함수
 */

import * as S from './PointPackSection.styled';

export default function PointPackSection({ packs, processingId, onBuyPack, formatNumber }) {
  return (
    <S.Grid>
      {packs.map((pack) => (
        /* $best prop으로 BEST 팩 강조 스타일 토글 (인라인 className 제거) */
        <S.Card key={pack.id} $best={pack.best}>
          {/* 보너스/최고 혜택 배지 */}
          {pack.best && (
            <S.Badge>BEST</S.Badge>
          )}

          {/* 포인트 수량 */}
          <S.Points>{pack.label}</S.Points>

          {/* 보너스 안내 */}
          {pack.bonus && (
            <S.BonusTag>{pack.bonus}</S.BonusTag>
          )}

          {/* 가격 */}
          <S.Price>
            {formatNumber(pack.price)}원
          </S.Price>

          {/* 구매 버튼 */}
          <S.BuyButton
            onClick={() => onBuyPack(pack)}
            disabled={processingId === pack.id}
          >
            {processingId === pack.id ? '처리 중...' : '구매하기'}
          </S.BuyButton>
        </S.Card>
      ))}
    </S.Grid>
  );
}
