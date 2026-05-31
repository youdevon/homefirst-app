export const LOGO_DISPLAY_MODE_VALUES = ["icon-text", "full-logo"] as const;

export type LogoDisplayMode = (typeof LOGO_DISPLAY_MODE_VALUES)[number];

export const DEFAULT_LOGO_DISPLAY_MODE: LogoDisplayMode = "icon-text";

export const LOGO_DISPLAY_MODE_OPTIONS: {
  value: LogoDisplayMode;
  label: string;
}[] = [
  { value: "icon-text", label: "Icon + Text" },
  { value: "full-logo", label: "Full Logo Image" },
];

export function isLogoDisplayMode(value: string): value is LogoDisplayMode {
  return LOGO_DISPLAY_MODE_VALUES.includes(value as LogoDisplayMode);
}

export function normalizeLogoDisplayMode(
  value: string | null | undefined,
): LogoDisplayMode {
  if (value && isLogoDisplayMode(value)) {
    return value;
  }

  return DEFAULT_LOGO_DISPLAY_MODE;
}

export function getLogoDisplayModeLabel(mode: LogoDisplayMode): string {
  return (
    LOGO_DISPLAY_MODE_OPTIONS.find((option) => option.value === mode)?.label ??
    LOGO_DISPLAY_MODE_OPTIONS[0].label
  );
}

export function resolvePublicLogoDisplayMode(
  mode: LogoDisplayMode,
  logoUrl: string | null,
): LogoDisplayMode {
  if (mode === "full-logo" && logoUrl) {
    return "full-logo";
  }

  return "icon-text";
}
