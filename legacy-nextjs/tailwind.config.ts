import type { Config } from "tailwindcss";

/**
 * Design system — SYSCOM + Seguridad Avanzada
 * docs/design-system-palette.md
 * Colores vía variables CSS para soporte light/dark.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Design system tokens (usan vars para dark mode) */
        background: "var(--color-background)",
        "background-alt": "var(--color-background-alt)",
        primary: "var(--color-primary)",
        "primary-nav": "var(--color-primary-nav)",
        "on-primary": "var(--color-on-primary)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "on-accent": "var(--color-on-accent)",
        foreground: "var(--color-foreground)",
        "foreground-muted": "var(--color-foreground-muted)",
        /* Semántica de seguridad */
        success: "var(--color-success)",
        "success-bg": "var(--color-success-bg)",
        error: "var(--color-error)",
        "error-bg": "var(--color-error-bg)",
        warning: "var(--color-warning)",
        "warning-bg": "var(--color-warning-bg)",
        info: "var(--color-info)",
        "info-bg": "var(--color-info-bg)",
        border: "var(--color-border)",
        "border-subtle": "var(--color-border-subtle)",
        /* Compatibilidad: syscom apunta a los mismos tokens */
        syscom: {
          primary: "var(--color-primary)",
          "primary-dark": "var(--color-primary-nav)",
          "primary-nav": "var(--color-primary-nav)",
          "nav-dark": "var(--color-primary-nav)",
          "nav-mid": "var(--color-primary-nav)",
          secondary: "var(--color-foreground-muted)",
          accent: "var(--color-accent)",
          "accent-hover": "var(--color-accent-hover)",
          background: "var(--color-background)",
          surface: "var(--color-background-alt)",
          border: "var(--color-border)",
          text: "var(--color-foreground)",
          "text-muted": "var(--color-foreground-muted)",
          "hero-bg": "var(--color-primary-nav)",
          "super-precio": "var(--color-accent)",
          "cart-amber": "var(--color-accent)",
        },
        semantic: {
          success: "var(--color-success)",
          "success-bg": "var(--color-success-bg)",
          error: "var(--color-error)",
          "error-bg": "var(--color-error-bg)",
          warning: "var(--color-warning)",
          "warning-bg": "var(--color-warning-bg)",
          info: "var(--color-info)",
          "info-bg": "var(--color-info-bg)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        mono: ["var(--font-jb-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "caption-tech": ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.03em" }],
      },
      boxShadow: {
        syscom: "0 1px 3px rgba(0,0,0,0.08)",
        "syscom-accent": "0 2px 8px rgba(232, 93, 4, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
