import { Text as RNText, type TextProps } from 'react-native';
import { colors, font, size } from '../theme/tokens';

type Variant = 'hero' | 'display' | 'title' | 'body' | 'label' | 'caption' | 'tab';

const styles: Record<Variant, object> = {
  hero: { fontFamily: font.display, fontSize: size.display, lineHeight: 38, letterSpacing: -0.6, color: colors.text },
  display: { fontFamily: font.bold, fontSize: size.display, lineHeight: 40, letterSpacing: -0.6, color: colors.text, fontVariant: ['tabular-nums'] },
  title: { fontFamily: font.semibold, fontSize: size.title, lineHeight: 28, color: colors.text },
  body: { fontFamily: font.regular, fontSize: size.body, lineHeight: 24, color: colors.text },
  label: { fontFamily: font.medium, fontSize: size.label, lineHeight: 20, color: colors.text },
  caption: { fontFamily: font.medium, fontSize: size.caption, lineHeight: 18, color: colors.text2 },
  tab: { fontFamily: font.medium, fontSize: size.tab, lineHeight: 16, color: colors.text3 },
};

export function T({ variant = 'body', bold, style, ...rest }: TextProps & { variant?: Variant; bold?: boolean }) {
  return <RNText {...rest} style={[styles[variant], bold && { fontFamily: font.semibold }, style]} />;
}
