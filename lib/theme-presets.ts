export const THEME_PRESET_VALUES = [
  "green",
  "blue",
  "sand",
  "burgundy",
  "midnight-emerald",
  "slate-night",
  "charcoal-copper",
] as const;

export type ThemePreset = (typeof THEME_PRESET_VALUES)[number];

export const DEFAULT_THEME_PRESET: ThemePreset = "green";

export const THEME_PRESET_OPTIONS: {
  value: ThemePreset;
  label: string;
}[] = [
  { value: "green", label: "Classic Government Green" },
  { value: "blue", label: "Coastal Blue" },
  { value: "sand", label: "Warm Community Sand" },
  { value: "burgundy", label: "Burgundy & Gold" },
  { value: "midnight-emerald", label: "Midnight Emerald" },
  { value: "slate-night", label: "Slate Blue Night" },
  { value: "charcoal-copper", label: "Charcoal Copper" },
];

export function isThemePreset(value: string): value is ThemePreset {
  return THEME_PRESET_VALUES.includes(value as ThemePreset);
}

export function normalizeThemePreset(value: string | null | undefined): ThemePreset {
  if (value && isThemePreset(value)) {
    return value;
  }

  return DEFAULT_THEME_PRESET;
}

export function getThemePresetLabel(preset: ThemePreset): string {
  return (
    THEME_PRESET_OPTIONS.find((option) => option.value === preset)?.label ??
    THEME_PRESET_OPTIONS[0].label
  );
}
