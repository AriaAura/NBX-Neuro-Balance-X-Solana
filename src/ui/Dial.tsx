import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { color, shadow } from './theme';

/**
 * The stacked clay dial from Focus Mode: a raised outer disc, two pressed-in
 * rings, and a glowing pearl face. `progress` (0–1) draws a thin arc on the
 * innermost ring; `tint` recolours the glow (blue for focus, coral for urges,
 * green for a win).
 */
export function Dial({
  size,
  progress = 0,
  tint = 'focus',
  children,
}: {
  size: number;
  progress?: number;
  tint?: 'focus' | 'urge' | 'victory';
  children?: ReactNode;
}) {
  const face = size * 0.68;
  const glow = { focus: '#CDE6FF', urge: '#FFD9DA', victory: '#CFF5E6' }[tint];
  const arc = { focus: color.blue, urge: color.urge, victory: color.victory }[tint];
  const r = size * 0.39;
  const circumference = 2 * Math.PI * r;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: color.surface,
        borderWidth: 2,
        borderColor: color.rim,
        boxShadow: shadow.raised,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ring size={size * 0.9} />
      <Ring size={size * 0.82} />
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={arc}
          strokeOpacity={progress > 0 ? 0.55 : 0}
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference * (1 - progress)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          width: face,
          height: face,
          borderRadius: face,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.9)',
          boxShadow: `0px 0px 34px ${glow}`,
        }}
      >
        <Svg width={face} height={face}>
          <Defs>
            <RadialGradient id="pearl" cx="50%" cy="52%" r="55%">
              <Stop offset="0" stopColor="#FFFFFF" />
              <Stop offset="0.45" stopColor="#F4FAFF" />
              <Stop offset="1" stopColor={glow} />
            </RadialGradient>
          </Defs>
          <Circle cx={face / 2} cy={face / 2} r={face / 2} fill="url(#pearl)" />
        </Svg>
      </View>
      <View style={{ position: 'absolute', alignItems: 'center' }}>{children}</View>
    </View>
  );
}

function Ring({ size }: { size: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: '#EEF0F4',
        boxShadow: shadow.inset,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
      }}
    />
  );
}
