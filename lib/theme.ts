// Single source of truth for brand colors.
// Admin page writes to Supabase app_config, which updates these via CSS variables.
// Components should use CSS var(--brand) instead of hardcoded hex.

export const THEME = {
  brand:      "var(--brand)",
  brandLight: "var(--brand-light)",
  brandDark:  "var(--brand-dark)",
  success:    "var(--success)",
  danger:     "var(--danger)",
} as const;

// Default config (overridden by Supabase app_config)
export const DEFAULT_CONFIG = {
  appName:      "CariBuddy",
  logoEmoji:    "👥",
  primaryColor: "#C4622D",
  fontFamily:   "geist",
  tagline:      "Cari rakan aktiviti kamu",
};

export type AppConfig = typeof DEFAULT_CONFIG;
