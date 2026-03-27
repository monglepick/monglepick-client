/**
 * 커스텀 모달 다이얼로그 컴포넌트.
 *
 * window.confirm / window.alert를 대체하는 글래스모피즘 모달.
 * ModalProvider와 함께 사용하며, useModal 훅을 통해 호출한다.
 *
 * 지원 모드:
 *   - alert   : 확인 버튼 1개 (정보/성공/경고/에러)
 *   - confirm : 취소 + 확인 버튼 2개
 *
 * 타입별 기본 아이콘:
 *   - info    : ℹ️
 *   - success : ✅
 *   - warning : ⚠️
 *   - error   : ❌
 *   - confirm : 🤔
 *
 * @param {Object} props
 * @param {'alert'|'confirm'} props.mode - 모달 모드 (alert: 확인만, confirm: 확인+취소)
 * @param {'info'|'success'|'warning'|'error'|'confirm'} [props.type='info'] - 타입 (아이콘/색상)
 * @param {string} [props.icon] - 커스텀 아이콘 (미지정 시 타입별 기본 아이콘)
 * @param {string} props.title - 모달 제목
 * @param {string} props.message - 모달 메시지 (줄바꿈 지원)
 * @param {string} [props.confirmLabel='확인'] - 확인 버튼 라벨
 * @param {string} [props.cancelLabel='취소'] - 취소 버튼 라벨
 * @param {function} props.onConfirm - 확인 클릭 시 콜백
 * @param {function} [props.onCancel] - 취소 클릭 시 콜백 (confirm 모드)
 */

import { useEffect, useCallback, useState } from 'react';
import * as S from './Modal.styled';

/** 타입별 기본 아이콘 매핑 */
const DEFAULT_ICONS = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  confirm: '🤔',
};

/** 닫기 애니메이션 지속 시간 (ms) */
const CLOSE_ANIMATION_MS = 200;

export default function Modal({
  mode = 'alert',
  type = 'info',
  icon,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}) {
  /* 닫기 애니메이션 상태 — true면 퇴장 애니메이션 재생 후 언마운트 */
  const [closing, setClosing] = useState(false);

  /** 닫기 애니메이션을 재생한 뒤 콜백을 호출하는 헬퍼 */
  const closeWithAnimation = useCallback((callback) => {
    setClosing(true);
    setTimeout(() => {
      callback?.();
    }, CLOSE_ANIMATION_MS);
  }, []);

  /** 확인 버튼 클릭 핸들러 */
  const handleConfirm = useCallback(() => {
    closeWithAnimation(onConfirm);
  }, [onConfirm, closeWithAnimation]);

  /** 취소 버튼 클릭 핸들러 */
  const handleCancel = useCallback(() => {
    closeWithAnimation(onCancel);
  }, [onCancel, closeWithAnimation]);

  /** 오버레이(배경) 클릭 시 — confirm 모드면 취소, alert 모드면 확인 */
  const handleOverlayClick = useCallback((e) => {
    /* 오버레이 자체 클릭만 처리 (버블링 방지) */
    if (e.target === e.currentTarget) {
      if (mode === 'confirm') {
        handleCancel();
      } else {
        handleConfirm();
      }
    }
  }, [mode, handleCancel, handleConfirm]);

  /** ESC 키로 닫기 — confirm이면 취소, alert이면 확인 */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (mode === 'confirm') {
          handleCancel();
        } else {
          handleConfirm();
        }
      }
      /* Enter 키로 확인 */
      if (e.key === 'Enter') {
        handleConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, handleCancel, handleConfirm]);

  /** 모달 열릴 때 body 스크롤 방지 */
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  /* 표시할 아이콘 — 커스텀 > 타입별 기본값 */
  const displayIcon = icon || DEFAULT_ICONS[type] || DEFAULT_ICONS.info;
  const isAlert = mode === 'alert';

  return (
    <>
      {/* 반투명 블러 오버레이 */}
      <S.Overlay $closing={closing} onClick={handleOverlayClick} />

      {/* 모달 본체 */}
      <S.Container $closing={closing} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* 타입별 아이콘 */}
        <S.IconArea $type={type} aria-hidden="true">
          {displayIcon}
        </S.IconArea>

        {/* 제목 */}
        <S.Title id="modal-title">{title}</S.Title>

        {/* 메시지 본문 */}
        <S.Message>{message}</S.Message>

        {/* 버튼 영역 */}
        <S.ButtonGroup $single={isAlert}>
          {/* confirm 모드일 때만 취소 버튼 표시 */}
          {!isAlert && (
            <S.SecondaryButton onClick={handleCancel}>
              {cancelLabel}
            </S.SecondaryButton>
          )}

          {/* 확인 버튼 (항상 표시) */}
          <S.PrimaryButton onClick={handleConfirm} autoFocus>
            {confirmLabel}
          </S.PrimaryButton>
        </S.ButtonGroup>
      </S.Container>
    </>
  );
}
