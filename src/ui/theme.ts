// NBX design tokens, measured from the brand renders.
// Light only: soft white clay, slate ink, one blue → violet accent family.

export const color = {
  bg: '#F5F6F8', // the "clay" every surface is pressed out of
  surface: '#F8F9FB',
  rim: 'rgba(255,255,255,0.95)',

  ink: '#2C3A4D', // headings, big numbers
  inkSoft: '#3B4757', // button labels
  inkMuted: '#8A93A2', // secondary labels ("FOCUS MODE", "Rewire your brain")
  hairline: 'rgba(138,147,162,0.18)',

  blue: '#3F9BEA',
  indigo: '#7B7FF2',
  violet: '#9E62E6',
  squad: '#3D3FD8',

  glow: '#BFE0FF',
  victory: '#2FBF8F', // green is only ever used for wins
  urge: '#E5484D', // the one alarm colour, reserved for the craving button
} as const;

export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  heavy: 'Inter_800ExtraBold',
} as const;

// Deep neumorphism: one cool shadow bottom-right, one white light top-left.
export const shadow = {
  raised:
    '10px 12px 24px rgba(160,170,192,0.38), -8px -8px 20px rgba(255,255,255,0.95)',
  raisedSoft:
    '6px 8px 16px rgba(160,170,192,0.30), -6px -6px 14px rgba(255,255,255,0.95)',
  pressed:
    'inset 5px 5px 12px rgba(160,170,192,0.35), inset -5px -5px 12px rgba(255,255,255,0.95)',
  inset:
    'inset 4px 4px 10px rgba(160,170,192,0.30), inset -4px -4px 10px rgba(255,255,255,0.9)',
  glow: '0px 0px 40px rgba(120,170,255,0.45)',
} as const;

export const radius = {
  control: 14,
  button: 18,
  card: 28,
  pill: 999,
} as const;

export const space = (n: number) => n * 4;
