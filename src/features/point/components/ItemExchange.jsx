/**
 * 아이템 교환 섹션 컴포넌트.
 *
 * 카테고리 필터 탭과 아이템 카드 그리드를 렌더링한다.
 * 각 카드에는 카테고리 태그, 이름, 설명, 가격, 교환 버튼이 포함된다.
 *
 * @param {Object} props
 * @param {Array} props.items - 아이템 목록 배열
 * @param {string} props.selectedCategory - 현재 선택된 카테고리
 * @param {Function} props.onCategoryChange - 카테고리 변경 핸들러
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {number|null} props.exchangingItemId - 교환 처리 중인 아이템 ID
 * @param {number} props.balance - 현재 보유 포인트
 * @param {Function} props.onExchangeItem - 아이템 교환 핸들러
 * @param {Function} props.formatNumber - 숫자 포맷팅 함수
 */

import Loading from '../../../shared/components/Loading/Loading';
import * as S from './ItemExchange.styled';

/** 아이템 카테고리 필터 탭 목록 */
const ITEM_CATEGORIES = ['전체', 'AI', '쿠폰', '아바타'];

export default function ItemExchange({
  items,
  selectedCategory,
  onCategoryChange,
  isLoading,
  exchangingItemId,
  balance,
  onExchangeItem,
  formatNumber,
}) {
  return (
    <S.Section>
      <S.SectionTitle>아이템 교환</S.SectionTitle>

      {/* 카테고리 필터 탭 */}
      <S.Tabs>
        {ITEM_CATEGORIES.map((category) => (
          <S.Tab
            key={category}
            $active={selectedCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </S.Tab>
        ))}
      </S.Tabs>

      {/* 아이템 그리드 */}
      {isLoading ? (
        <Loading message="아이템 로딩 중..." />
      ) : items.length === 0 ? (
        <S.Empty>
          <p>교환 가능한 아이템이 없습니다.</p>
        </S.Empty>
      ) : (
        <S.Grid>
          {items.map((item) => (
            <S.Card key={item.itemId}>
              {/* 아이템 카테고리 태그 */}
              <S.CategoryTag>{item.category}</S.CategoryTag>
              {/* 아이템 이름 */}
              <S.ItemName>{item.name}</S.ItemName>
              {/* 아이템 설명 */}
              <S.ItemDesc>{item.description}</S.ItemDesc>
              {/* 가격 및 교환 버튼 */}
              <S.Footer>
                <S.Price>{formatNumber(item.price)}P</S.Price>
                <S.ExchangeBtn
                  onClick={() => onExchangeItem(item)}
                  disabled={
                    exchangingItemId === item.itemId ||
                    (balance || 0) < item.price
                  }
                >
                  {exchangingItemId === item.itemId
                    ? '교환 중...'
                    : (balance || 0) < item.price
                      ? '포인트 부족'
                      : '교환'}
                </S.ExchangeBtn>
              </S.Footer>
            </S.Card>
          ))}
        </S.Grid>
      )}
    </S.Section>
  );
}
