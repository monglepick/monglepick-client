/**
 * 디자인 시스템 테마 객체.
 *
 * variables.css의 86개 CSS 변수를 JS 객체로 1:1 매핑한다.
 * styled-components의 ThemeProvider를 통해 모든 컴포넌트에서
 * ${({ theme }) => theme.colors.primary} 형태로 참조할 수 있다.
 *
 * 카테고리: colors, spacing, typography, shadows, radius,
 *           transitions, layout, zIndex, gradients, glows, glass
 */

const theme = {
  /* ── 색상 (Colors) ── */
  colors: {
    /* 기본(Primary) 색상 — 보라색 계열 */
    primary: '#7c6cf0',
    primaryHover: '#6b5ce0',
    primaryLight: 'rgba(124, 108, 240, 0.15)',
    primaryDark: '#5a4cc0',

    /* 배경(Background) 색상 — 진한 남색 계열 */
    bgMain: '#0f0f1a',
    bgCard: '#1a1a2e',
    bgElevated: '#222240',
    bgInput: '#16162b',
    bgOverlay: 'rgba(0, 0, 0, 0.6)',
    bgSecondary: '#1e1e35',
    bgTertiary: '#2a2a48',

    /* 텍스트(Text) 색상 */
    textPrimary: '#e8e8f0',
    textSecondary: '#8888a0',
    textMuted: '#555570',
    textInverse: '#0f0f1a',

    /* 상태(Status) 색상 */
    success: '#4ade80',
    successBg: 'rgba(74, 222, 128, 0.1)',
    warning: '#fbbf24',
    warningBg: 'rgba(251, 191, 36, 0.1)',
    error: '#f87171',
    errorBg: 'rgba(248, 113, 113, 0.1)',
    info: '#60a5fa',
    infoBg: 'rgba(96, 165, 250, 0.1)',

    /* 테두리(Border) 색상 */
    borderDefault: '#2a2a45',
    borderLight: '#1e1e38',
    borderFocus: '#7c6cf0',

    /* 평점 별(Rating Star) 색상 */
    starFilled: '#fbbf24',
    starEmpty: '#3a3a55',
  },

  /* ── 간격 (Spacing) ── */
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  /* ── 타이포그래피 (Typography) ── */
  typography: {
    /* 폰트 패밀리 */
    fontFamily:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans KR', sans-serif",
    fontMono: "'Fira Code', 'SF Mono', Menlo, Consolas, monospace",

    /* 폰트 크기 */
    textXs: '0.75rem',     /* 12px */
    textSm: '0.875rem',    /* 14px */
    textBase: '1rem',       /* 16px */
    textLg: '1.125rem',     /* 18px */
    textXl: '1.25rem',      /* 20px */
    text2xl: '1.5rem',      /* 24px */
    text3xl: '1.875rem',    /* 30px */
    text4xl: '2.25rem',     /* 36px */

    /* 폰트 두께 */
    fontNormal: 400,
    fontMedium: 500,
    fontSemibold: 600,
    fontBold: 700,

    /* 줄 높이 */
    leadingTight: 1.25,
    leadingNormal: 1.5,
    leadingRelaxed: 1.75,
  },

  /* ── 그림자 (Shadows) ── */
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(124, 108, 240, 0.3)',
  },

  /* ── 라운딩 (Border Radius) ── */
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  /* ── 트랜지션 (Transitions) ── */
  transitions: {
    fast: '150ms ease',
    base: '250ms ease',
    slow: '400ms ease',
  },

  /* ── 레이아웃 (Layout) ── */
  layout: {
    headerHeight: '64px',
    footerHeight: '60px',
    sidebarWidth: '280px',
    contentMaxWidth: '1200px',
    contentNarrow: '800px',
  },

  /* ── Z-인덱스 (Z-Index) ── */
  zIndex: {
    dropdown: 100,
    sticky: 200,
    modalBackdrop: 300,
    modal: 400,
    toast: 500,
  },

  /* ── 그라데이션 (Gradients) ── */
  gradients: {
    primary: 'linear-gradient(135deg, #7c6cf0 0%, #06d6a0 100%)',
    accent: 'linear-gradient(135deg, #ef476f 0%, #ffd166 50%, #06d6a0 100%)',
    text: 'linear-gradient(135deg, #7c6cf0, #06d6a0, #60a5fa)',
    cardBorder:
      'linear-gradient(135deg, rgba(124,108,240,0.5), rgba(6,214,160,0.5), rgba(124,108,240,0.5))',
    glow: 'radial-gradient(circle, rgba(124,108,240,0.15) 0%, transparent 70%)',
  },

  /* ── 네온 글로우 (Glow Effects) ── */
  glows: {
    primary:
      '0 0 20px rgba(124,108,240,0.4), 0 0 40px rgba(124,108,240,0.2)',
    cyan: '0 0 20px rgba(6,214,160,0.4), 0 0 40px rgba(6,214,160,0.2)',
    pink: '0 0 20px rgba(239,71,111,0.4)',
  },

  /* ── 글래스모피즘 (Glassmorphism) ── */
  glass: {
    bg: 'rgba(26, 26, 46, 0.6)',
    border: 'rgba(124, 108, 240, 0.15)',
    blur: 'blur(16px) saturate(1.8)',
  },
};

export default theme;
