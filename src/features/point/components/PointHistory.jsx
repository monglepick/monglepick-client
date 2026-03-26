/**
 * 포인트 이력 섹션 컴포넌트.
 *
 * 적립/차감 내역을 테이블로 표시하고, 페이지네이션을 제공한다.
 * 양수(적립)는 초록색, 음수(차감)는 빨간색으로 구분한다.
 *
 * @param {Object} props
 * @param {Object} props.history - 이력 페이지 데이터 {content, totalPages, totalElements}
 * @param {number} props.historyPage - 현재 페이지 번호 (0-indexed)
 * @param {boolean} props.isLoading - 로딩 상태
 * @param {Function} props.onPageChange - 페이지 변경 핸들러
 * @param {Function} props.formatNumber - 숫자 포맷팅 함수
 * @param {Function} props.formatDate - 날짜 포맷팅 함수
 */

import Loading from '../../../shared/components/Loading/Loading';
import * as S from './PointHistory.styled';

export default function PointHistory({
  history,
  historyPage,
  isLoading,
  onPageChange,
  formatNumber,
  formatDate,
}) {
  return (
    <S.HistorySection>
      <S.SectionTitle>
        포인트 이력
        {history.totalElements > 0 && (
          <S.HistoryCount>
            ({formatNumber(history.totalElements)}건)
          </S.HistoryCount>
        )}
      </S.SectionTitle>

      {isLoading ? (
        <Loading message="이력 로딩 중..." />
      ) : history.content.length === 0 ? (
        <S.HistoryEmpty>
          <p>포인트 이력이 없습니다.</p>
        </S.HistoryEmpty>
      ) : (
        <>
          {/* 이력 테이블 */}
          <S.TableWrapper>
            <S.HistoryTable>
              <thead>
                <tr>
                  <S.Th>내용</S.Th>
                  <S.Th>변동</S.Th>
                  <S.Th>잔액</S.Th>
                  <S.Th>일시</S.Th>
                </tr>
              </thead>
              <tbody>
                {history.content.map((item, idx) => {
                  /* 양수(적립)는 초록색, 음수(차감)는 빨간색 */
                  const isPositive = item.pointChange > 0;
                  return (
                    <S.Tr key={item.id || idx}>
                      <S.DescCell>
                        {item.description || '-'}
                      </S.DescCell>
                      <S.ChangeCell $positive={isPositive}>
                        {isPositive ? '+' : ''}{formatNumber(item.pointChange)}P
                      </S.ChangeCell>
                      <S.AfterCell>
                        {formatNumber(item.pointAfter)}P
                      </S.AfterCell>
                      <S.DateCell>
                        {formatDate(item.createdAt)}
                      </S.DateCell>
                    </S.Tr>
                  );
                })}
              </tbody>
            </S.HistoryTable>
          </S.TableWrapper>

          {/* 페이지네이션 */}
          {history.totalPages > 1 && (
            <S.Pagination>
              {/* 이전 페이지 */}
              <S.PaginationBtn
                onClick={() => onPageChange((prev) => Math.max(0, prev - 1))}
                disabled={historyPage === 0}
              >
                이전
              </S.PaginationBtn>

              {/* 페이지 번호 */}
              <S.PaginationInfo>
                {historyPage + 1} / {history.totalPages}
              </S.PaginationInfo>

              {/* 다음 페이지 */}
              <S.PaginationBtn
                onClick={() =>
                  onPageChange((prev) => Math.min(history.totalPages - 1, prev + 1))
                }
                disabled={historyPage >= history.totalPages - 1}
              >
                다음
              </S.PaginationBtn>
            </S.Pagination>
          )}
        </>
      )}
    </S.HistorySection>
  );
}
