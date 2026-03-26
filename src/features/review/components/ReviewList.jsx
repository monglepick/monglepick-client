/**
 * 영화 리뷰 목록 컴포넌트.
 *
 * 특정 영화에 대한 사용자 리뷰들을 리스트로 표시한다.
 * 각 리뷰는 작성자, 평점(별), 내용, 작성일을 보여준다.
 *
 * @param {Object} props
 * @param {Array} props.reviews - 리뷰 배열
 * @param {boolean} [props.loading=false] - 로딩 상태
 */

/* 포맷팅 유틸 — shared/utils에서 가져옴 */
import { formatRelativeTime, formatRatingStars, formatRating } from '../../../shared/utils/formatters';
/* 로딩 스피너 — shared/components에서 가져옴 */
import Loading from '../../../shared/components/Loading/Loading';
import * as S from './ReviewList.styled';

export default function ReviewList({ reviews = [], loading = false }) {
  // 로딩 중 표시
  if (loading) {
    return <Loading message="리뷰를 불러오는 중..." />;
  }

  // 리뷰가 없을 때
  if (!reviews || reviews.length === 0) {
    return (
      <S.Empty>
        <S.EmptyText>아직 작성된 리뷰가 없습니다.</S.EmptyText>
        <S.EmptyHint>첫 번째 리뷰를 남겨보세요!</S.EmptyHint>
      </S.Empty>
    );
  }

  return (
    <S.Wrapper>
      {reviews.map((review) => (
        <S.Item key={review.id}>
          {/* 리뷰 헤더 — 작성자 + 작성일 */}
          <S.ItemHeader>
            <S.AuthorInfo>
              {/* 작성자 아바타 */}
              <S.Avatar>
                {review.author?.nickname?.charAt(0) || 'U'}
              </S.Avatar>
              <div>
                <S.AuthorName>
                  {review.author?.nickname || '익명'}
                </S.AuthorName>
                <S.Time>
                  {formatRelativeTime(review.createdAt)}
                </S.Time>
              </div>
            </S.AuthorInfo>

            {/* 평점 표시 */}
            <S.Rating>
              <S.Stars>
                {formatRatingStars(review.rating)}
              </S.Stars>
              <S.Score>
                {formatRating(review.rating)}
              </S.Score>
            </S.Rating>
          </S.ItemHeader>

          {/* 리뷰 내용 */}
          <S.ReviewContent>{review.content}</S.ReviewContent>

          {/* 좋아요 버튼 */}
          <S.Footer>
            <S.LikeBtn>
              ♡ {review.likeCount || 0}
            </S.LikeBtn>
          </S.Footer>
        </S.Item>
      ))}
    </S.Wrapper>
  );
}
