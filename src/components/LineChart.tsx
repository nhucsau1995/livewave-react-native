import { View } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { colors } from '../theme/tokens';

// 60-second bitrate chart: accent line for the samples, dashed support line for the target.
export function LineChart({ data, target, width, height = 110 }: { data: number[]; target: number; width: number; height?: number }) {
  const max = Math.max(target * 1.35, ...data);
  const min = 0;
  const y = (v: number) => height - 6 - ((v - min) / (max - min)) * (height - 12);
  const x = (i: number) => (i / Math.max(1, data.length - 1)) * width;
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${d} L${width},${height} L0,${height} Z`;
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Path d={area} fill={colors.accentTint} opacity={0.7} />
        <Line x1={0} x2={width} y1={y(target)} y2={y(target)} stroke={colors.supportStrong} strokeWidth={1.5} strokeDasharray="5 5" />
        <Path d={d} stroke={colors.accent} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
    </View>
  );
}
