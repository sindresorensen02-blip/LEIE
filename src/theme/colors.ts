export const colors = {
  bg: '#04060B',
  bgElevated: '#0A1220',
  surface: '#0E1A2E',
  surfaceHigh: '#13223C',
  border: '#1C2A44',
  borderStrong: '#27395C',

  text: '#E8F1FF',
  textMuted: '#94A8C8',
  textDim: '#5C7396',

  cyan: '#5BE3F2',
  teal: '#2BC4D9',
  blue: '#7CA8FF',
  indigo: '#3D5BFF',

  glow: 'rgba(91, 227, 242, 0.55)',
  glowSoft: 'rgba(91, 227, 242, 0.18)',
  scrim: 'rgba(4, 6, 11, 0.78)',

  success: '#3DDC97',
  warning: '#F5C26B',
  danger: '#FF6B6B',

  markerRoom: '#5BE3F2',
  markerStudio: '#7CA8FF',
  markerApartment: '#A78BFA',
  markerHouse: '#3DDC97',
} as const;

export type ColorKey = keyof typeof colors;
