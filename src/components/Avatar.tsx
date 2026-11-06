import { Image, View } from 'react-native';
import { images, type ImageKey } from '../data/images';
import { colors, font } from '../theme/tokens';
import { T } from './Text';

export function Avatar({ img, size = 40, ring, name }: { img?: ImageKey; size?: number; ring?: boolean; name?: string }) {
  const inner = ring ? size - 8 : size;
  const body = img ? (
    <Image source={images[img]} style={{ width: inner, height: inner, borderRadius: inner / 2 }} />
  ) : (
    <View style={{ width: inner, height: inner, borderRadius: inner / 2, backgroundColor: colors.accentFill, alignItems: 'center', justifyContent: 'center' }}>
      <T variant="caption" style={{ color: colors.white, fontFamily: font.bold }}>{name?.[0] ?? '?'}</T>
    </View>
  );
  if (!ring) return body;
  return <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2.5, borderColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>{body}</View>;
}
