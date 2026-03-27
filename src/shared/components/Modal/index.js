/**
 * Modal 컴포넌트 배럴 export.
 *
 * 외부에서 사용하는 주요 API:
 *   import { ModalProvider, useModal } from '../shared/components/Modal';
 *
 *   // Provider 감싸기 (main.jsx)
 *   <ModalProvider><App /></ModalProvider>
 *
 *   // 컴포넌트에서 호출
 *   const { showAlert, showConfirm } = useModal();
 */

export { ModalProvider, useModal } from './ModalProvider';
export { default as Modal } from './Modal';
