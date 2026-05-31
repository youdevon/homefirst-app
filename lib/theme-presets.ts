export const LEGACY_DARK_THEME_PRESETS = [
  "midnight-emerald",
  "slate-night",
  "charcoal-copper",
] as const;

export type LegacyDarkThemePreset = (typeof LEGACY_DARK_THEME_PRESETS)[number];

export const THEME_PRESET_VALUES = [
  "green",
  "blue",
  "sand",
  "burgundy",
  "carnival-trinidad",
  "christmas-warm",
  "summer-coastal",
  "spring-garden",
  "autumn-harvest",
  "independence-red",
  "royal-purple",
  "winter-blue",
  ...LEGACY_DARK_THEME_PRESETS,
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
  { value: "carnival-trinidad", label: "Carnival Trinidad" },
  { value: "christmas-warm", label: "Christmas Warm" },
  { value: "summer-coastal", label: "Summer Coastal" },
  { value: "spring-garden", label: "Spring Garden" },
  { value: "autumn-harvest", label: "Autumn Harvest" },
  {
    value: "independence-red",
    label: "Independence Red, Black & White",
  },
  { value: "royal-purple", label: "Royal Purple & Gold" },
  { value: "winter-blue", label: "Winter Blue & Silver" },
];

const THEME_PRESET_LABELS: Record<ThemePreset, string> = {
  green: "Classic Government Green",
  blue: "Coastal Blue",
  sand: "Warm Community Sand",
  burgundy: "Burgundy & Gold",
  "carnival-trinidad": "Carnival Trinidad",
  "christmas-warm": "Christmas Warm",
  "summer-coastal": "Summer Coastal",
  "spring-garden": "Spring Garden",
  "autumn-harvest": "Autumn Harvest",
  "independence-red": "Independence Red, Black & White",
  "royal-purple": "Royal Purple & Gold",
  "winter-blue": "Winter Blue & Silver",
  "midnight-emerald": "Midnight Emerald",
  "slate-night": "Slate Blue Night",
  "charcoal-copper": "Charcoal Copper",
};

export function isLegacyDarkThemePreset(
  value: string,
): value is LegacyDarkThemePreset {
  return LEGACY_DARK_THEME_PRESETS.includes(value as LegacyDarkThemePreset);
}

export function isThemePreset(value: string): value is ThemePreset {
  return THEME_PRESET_VALUES.includes(value as ThemePreset);
}

export function normalizeThemePreset(
  value: string | null | undefined,
): ThemePreset {
  if (value && isLegacyDarkThemePreset(value)) {
    return DEFAULT_THEME_PRESET;
  }

  if (value && isThemePreset(value)) {
    return value;
  }

  return DEFAULT_THEME_PRESET;
}

export function getThemePresetLabel(preset: ThemePreset): string {
  return THEME_PRESET_LABELS[preset] ?? THEME_PRESET_LABELS[DEFAULT_THEME_PRESET];
}
