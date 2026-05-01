import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';
import { Listing, PropertyType } from '../types';
import { bergenSentrum } from '../data/mockListings';

const MARKER_COLOR: Record<PropertyType, string> = {
  room: colors.markerRoom,
  studio: colors.markerStudio,
  apartment: colors.markerApartment,
  house: colors.markerHouse,
};

interface Props {
  width: number;
  height: number;
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  isMapboxConfigured: boolean;
}

const project = (
  lat: number,
  lng: number,
  width: number,
  height: number,
): { x: number; y: number } => {
  const lngMin = bergenSentrum.longitude - bergenSentrum.longitudeDelta / 2;
  const lngMax = bergenSentrum.longitude + bergenSentrum.longitudeDelta / 2;
  const latMin = bergenSentrum.latitude - bergenSentrum.latitudeDelta / 2;
  const latMax = bergenSentrum.latitude + bergenSentrum.latitudeDelta / 2;

  const x = ((lng - lngMin) / (lngMax - lngMin)) * width;
  const y = (1 - (lat - latMin) / (latMax - latMin)) * height;
  return { x, y };
};

const seededRand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const cityLights = (width: number, height: number) => {
  const rand = seededRand(42);
  const dots: { x: number; y: number; r: number; o: number }[] = [];
  for (let i = 0; i < 90; i++) {
    dots.push({
      x: rand() * width,
      y: rand() * height,
      r: 0.6 + rand() * 1.4,
      o: 0.25 + rand() * 0.55,
    });
  }
  return dots;
};

const fjordPath = (width: number, height: number) => {
  const w = width;
  const h = height;
  return `M ${w * 0.1} ${h * 0.62}
          C ${w * 0.22} ${h * 0.55}, ${w * 0.32} ${h * 0.72}, ${w * 0.45} ${h * 0.66}
          S ${w * 0.7} ${h * 0.58}, ${w * 0.92} ${h * 0.7}`;
};

const coastPath = (width: number, height: number) => {
  const w = width;
  const h = height;
  return `M 0 ${h * 0.32}
          C ${w * 0.18} ${h * 0.28}, ${w * 0.32} ${h * 0.42}, ${w * 0.48} ${h * 0.34}
          S ${w * 0.7} ${h * 0.28}, ${w} ${h * 0.36}`;
};

interface MarkerNode {
  id: string;
  x: number;
  y: number;
  type: PropertyType;
  price: number;
}

const buildConnections = (markers: MarkerNode[], maxLines = 14) => {
  if (markers.length < 2) return [];
  const lines: { from: MarkerNode; to: MarkerNode }[] = [];
  const sorted = [...markers].sort((a, b) => b.price - a.price);
  const trunk = sorted.slice(0, Math.min(8, sorted.length));
  for (let i = 0; i < trunk.length - 1; i++) {
    lines.push({ from: trunk[i], to: trunk[i + 1] });
    if (lines.length >= maxLines) return lines;
  }
  for (let i = 0; i < trunk.length && lines.length < maxLines; i++) {
    const from = trunk[i];
    const to = trunk[(i + 3) % trunk.length];
    if (from.id !== to.id) lines.push({ from, to });
  }
  return lines;
};

const curvedPath = (a: MarkerNode, b: MarkerNode) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / dist;
  const ny = dx / dist;
  const curve = dist * 0.22;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
};

export const IlluminatedMap = ({
  width,
  height,
  listings,
  selectedId,
  onSelect,
  isMapboxConfigured,
}: Props) => {
  const markers: MarkerNode[] = useMemo(
    () =>
      listings.map((l) => {
        const p = project(l.latitude, l.longitude, width, height);
        return { id: l.id, x: p.x, y: p.y, type: l.propertyType, price: l.priceMonthly };
      }),
    [listings, width, height],
  );

  const lights = useMemo(() => cityLights(width, height), [width, height]);
  const lines = useMemo(() => buildConnections(markers), [markers]);

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#070D1A" />
            <Stop offset="0.55" stopColor="#04060B" />
            <Stop offset="1" stopColor="#020407" />
          </LinearGradient>
          <RadialGradient id="vignette" cx="50%" cy="50%" r="60%">
            <Stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <Stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </RadialGradient>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.cyan} stopOpacity="0.65" />
            <Stop offset="1" stopColor={colors.cyan} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill="url(#bg)" />

        {/* Subtle land/coast hint */}
        <Path
          d={coastPath(width, height)}
          stroke="#1B2C46"
          strokeWidth={1}
          fill="none"
          strokeOpacity={0.55}
        />
        <Path
          d={fjordPath(width, height)}
          stroke="#16314D"
          strokeWidth={1}
          fill="none"
          strokeOpacity={0.6}
        />

        {/* City light dots (decorative, like the reference image) */}
        {lights.map((d, i) => (
          <Circle key={`l-${i}`} cx={d.x} cy={d.y} r={d.r} fill="#9EC2FF" opacity={d.o} />
        ))}

        {/* Connection lines between top listings (Snap-Map-meets-flight-route feel) */}
        {lines.map((ln, i) => (
          <Path
            key={`c-${i}`}
            d={curvedPath(ln.from, ln.to)}
            stroke={colors.cyan}
            strokeWidth={0.6}
            strokeOpacity={0.28}
            fill="none"
          />
        ))}

        <Rect x={0} y={0} width={width} height={height} fill="url(#vignette)" />

        {/* Markers */}
        {markers.map((m) => {
          const selected = m.id === selectedId;
          const fill = MARKER_COLOR[m.type];
          return (
            <Circle
              key={`m-${m.id}`}
              cx={m.x}
              cy={m.y}
              r={selected ? 8 : 5}
              fill={fill}
              stroke="#04060B"
              strokeWidth={1.5}
              opacity={0.95}
            />
          );
        })}
      </Svg>

      {/* Animated pulse glow for the selected marker */}
      {markers
        .filter((m) => m.id === selectedId)
        .map((m) => (
          <PulseGlow key={`g-${m.id}`} cx={m.x} cy={m.y} color={MARKER_COLOR[m.type]} />
        ))}

      {/* Tap targets overlay */}
      {markers.map((m) => (
        <Pressable
          key={`t-${m.id}`}
          onPress={() => onSelect(m.id === selectedId ? null : m.id)}
          hitSlop={6}
          style={[
            styles.tap,
            { left: m.x - 18, top: m.y - 18 },
          ]}
        />
      ))}

      {/* Bergen label + status badges */}
      <View style={styles.locationBadge} pointerEvents="none">
        <Ionicons name="location-outline" size={12} color={colors.cyan} />
        <Text style={styles.locationText}>Bergen sentrum</Text>
      </View>

      {!isMapboxConfigured ? (
        <View style={styles.demoBadge} pointerEvents="none">
          <View style={styles.demoDot} />
          <Text style={styles.demoText}>Demo-kart · Mapbox ikke konfigurert</Text>
        </View>
      ) : (
        <View style={styles.demoBadge} pointerEvents="none">
          <View style={[styles.demoDot, { backgroundColor: colors.success }]} />
          <Text style={styles.demoText}>Mapbox-token oppdaget</Text>
        </View>
      )}
    </View>
  );
};

const PulseGlow = ({ cx, cy, color }: { cx: number; cy: number; color: string }) => {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.6, { duration: 1600, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 1600, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );
  }, [opacity, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pulse,
        { left: cx - 22, top: cy - 22, borderColor: color, shadowColor: color },
        animStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    overflow: 'hidden',
  },
  tap: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  pulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  locationBadge: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.scrim,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  locationText: {
    ...typography.micro,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoBadge: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.scrim,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  demoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
  },
  demoText: {
    ...typography.micro,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
