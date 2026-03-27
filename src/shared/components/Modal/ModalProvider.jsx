/**
 * 모달 컨텍스트 프로바이더.
 *
 * 앱 전역에서 useModal() 훅을 통해 모달을 호출할 수 있게 해주는 Provider.
 * Promise 기반 API로 동작하여 async/await 패턴으로 결과를 받을 수 있다.
 *
 * 사용법:
 *   // main.jsx에서 ThemeProvider 내부에 감싸기
 *   <ModalProvider>
 *     <App />
 *   </ModalProvider>
 *
 *   // 컴포넌트 내부에서
 *   const { showAlert, showConfirm } = useModal();
 *
 *   // Alert — 확인 버튼만 (정보/성공/경고/에러)
 *   await showAlert({ title: '완료', message: '교환되었습니다.', type: 'success' });
 *
 *   // Confirm — 확인/취소 (true/false 반환)
 *   const ok = await showConfirm({ title: '확인', message: '정말 삭제하시겠습니까?' });
 *   if (ok) { ... }
 */

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import Modal from './Modal';

/** 모달 컨텍스트 — null 초기값 (Provider 밖에서 호출 시 에러 감지용) */
const ModalContext = createContext(null);

/**
 * ModalProvider — 모달 상태 관리 + 렌더링 담당.
 *
 * 내부적으로 모달 설정(config)과 Promise resolve 함수(resolveRef)를 관리한다.
 * 모달이 열리면 config가 설정되고, 닫히면 config를 null로 초기화한다.
 */
export function ModalProvider({ children }) {
  /* 현재 표시 중인 모달 설정 — null이면 모달 없음 */
  const [config, setConfig] = useState(null);

  /* Promise resolve 함수 참조 — 모달 결과(true/false/undefined)를 반환 */
  const resolveRef = useRef(null);

  /**
   * showAlert — 알림 모달을 표시하고 확인 클릭 시 resolve.
   *
   * @param {Object} options
   * @param {string} options.title - 제목
   * @param {string} options.message - 메시지 (줄바꿈 가능)
   * @param {'info'|'success'|'warning'|'error'} [options.type='info'] - 타입
   * @param {string} [options.icon] - 커스텀 아이콘
   * @param {string} [options.confirmLabel='확인'] - 확인 버튼 라벨
   * @returns {Promise<void>} 확인 클릭 시 resolve
   */
  const showAlert = useCallback((options) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setConfig({
        mode: 'alert',
        type: options.type || 'info',
        icon: options.icon,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel || '확인',
      });
    });
  }, []);

  /**
   * showConfirm — 확인/취소 모달을 표시하고 결과를 boolean으로 반환.
   *
   * @param {Object} options
   * @param {string} options.title - 제목
   * @param {string} options.message - 메시지 (줄바꿈 가능)
   * @param {'info'|'success'|'warning'|'error'|'confirm'} [options.type='confirm'] - 타입
   * @param {string} [options.icon] - 커스텀 아이콘
   * @param {string} [options.confirmLabel='확인'] - 확인 버튼 라벨
   * @param {string} [options.cancelLabel='취소'] - 취소 버튼 라벨
   * @returns {Promise<boolean>} 확인=true, 취소=false
   */
  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setConfig({
        mode: 'confirm',
        type: options.type || 'confirm',
        icon: options.icon,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel || '확인',
        cancelLabel: options.cancelLabel || '취소',
      });
    });
  }, []);

  /** 확인 버튼 핸들러 — resolve 호출 후 모달 닫기 */
  const handleConfirm = useCallback(() => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setConfig(null);
    /* alert면 undefined, confirm이면 true */
    resolve?.(config?.mode === 'confirm' ? true : undefined);
  }, [config]);

  /** 취소 버튼 핸들러 — false로 resolve 후 모달 닫기 */
  const handleCancel = useCallback(() => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setConfig(null);
    resolve?.(false);
  }, []);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* 모달 설정이 있을 때만 렌더링 */}
      {config && (
        <Modal
          mode={config.mode}
          type={config.type}
          icon={config.icon}
          title={config.title}
          message={config.message}
          confirmLabel={config.confirmLabel}
          cancelLabel={config.cancelLabel}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ModalContext.Provider>
  );
}

/**
 * useModal — 모달 호출 훅.
 *
 * ModalProvider 내부에서만 사용 가능하다.
 * Provider 밖에서 호출 시 에러를 던진다.
 *
 * @returns {{ showAlert: function, showConfirm: function }}
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal은 ModalProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}

export default ModalContext;
