/**
 * 빈 상태(EmptyState) 컴포넌트.
 *
 * 목록에 데이터가 없을 때 아이콘, 안내 메시지, 액션 버튼을 표시한다.
 * 사용자에게 현재 비어있는 상태를 친절하게 안내하고,
 * 선택적으로 다음 행동을 유도하는 버튼을 제공한다.
 *
 * @param {Object} props
 * @param {string} [props.icon='📭'] - 표시할 이모지 아이콘
 * @param {string} props.title - 빈 상태 제목 (필수)
 * @param {string} [props.description] - 부가 설명 텍스트
 * @param {string} [props.actionLabel] - 액션 버튼 라벨 (없으면 버튼 숨김)
 * @param {function} [props.onAction] - 액션 버튼 클릭 핸들러
 */

import * as S from './EmptyState.styled';

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <S.Wrapper>
      {/* 큰 이모지 아이콘 */}
      <S.Icon aria-hidden="true">
        {icon}
      </S.Icon>

      {/* 제목 */}
      <S.Title>{title}</S.Title>

      {/* 부가 설명 (선택) */}
      {description && (
        <S.Description>{description}</S.Description>
      )}

      {/* 액션 버튼 (선택) */}
      {actionLabel && onAction && (
        <S.ActionButton onClick={onAction}>
          {actionLabel}
        </S.ActionButton>
      )}
    </S.Wrapper>
  );
}
