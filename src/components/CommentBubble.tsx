import { StyleSheet, View } from 'react-native';
import type { Comment } from '../data/models';
import { colors, font, radius } from '../theme/tokens';
import { Avatar } from './Avatar';
import { Icon } from './Icon';
import { T } from './Text';

// Live comment on video: dark translucent bubble, 28px avatar, bold name + message.
// Gift rows use the support green with dark text, system rows a stronger overlay.
export function CommentBubble({ c }: { c: Comment }) {
  if (c.kind === 'gift') {
    return (
      <View style={[styles.bubble, { backgroundColor: colors.support }]}>
        <Icon name="gift" size={16} color={colors.text} />
        <T variant="label" style={{ color: colors.text }}><T variant="label" style={{ color: colors.text, fontFamily: font.bold }}>{c.name} </T>{c.text}</T>
      </View>
    );
  }
  return (
    <View style={[styles.bubble, c.kind === 'system' && { backgroundColor: colors.overlayStrong }]}>
      <Avatar img={c.avatar} size={28} name={c.name} />
      <T variant="label" style={{ color: colors.white, flexShrink: 1 }}>
        <T variant="label" style={{ color: colors.white, fontFamily: font.bold }}>{c.name}  </T>{c.text}
      </T>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.overlay, borderRadius: radius.control, paddingVertical: 6, paddingLeft: 6, paddingRight: 12, alignSelf: 'flex-start', maxWidth: '100%' },
});
