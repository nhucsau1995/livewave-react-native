import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { CommentBubble } from '../../components/CommentBubble';
import { FloatingHearts, type HeartsHandle } from '../../components/FloatingHearts';
import { GiftSheet } from '../../components/GiftSheet';
import { IconButton } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { LivePill, ViewerPill } from '../../components/Pills';
import { T } from '../../components/Text';
import { images, type ImageKey } from '../../data/images';
import type { Comment } from '../../data/models';
import { creators, viewerChat } from '../../data/seed';
import { compact, grouped } from '../../logic/format';
import { useApp } from '../../store';
import { colors, font, radius } from '../../theme/tokens';

const videoFor: Record<string, ImageKey> = { lena: 'liveLena', kairo: 'streamDjKairo', marco: 'streamPasta', sam: 'streamHiit', aiko: 'streamSaxophone', sofia: 'streamPainter' };

export default function WatchLive() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = creators.find((x) => x.id === id) ?? creators[0];
  const insets = useSafeAreaInsets();
  const following = useApp((s) => s.following.includes(c.id));
  const toggleFollow = useApp((s) => s.toggleFollow);
  const hearts = useRef<HeartsHandle>(null);
  const [comments, setComments] = useState<Comment[]>(viewerChat.slice(0, 4));
  const [viewers, setViewers] = useState(2481);
  const [likes, setLikes] = useState(18300);
  const [sheet, setSheet] = useState(false);
  const [cc, setCc] = useState(false);
  const [more, setMore] = useState(false);
  const [reported, setReported] = useState<string | null>(null);

  // Simulated realtime: a burst of chat lines, viewer changes and hearts every ~1.6 s, then the
  // room goes quiet (taps still add hearts) so UI automation can settle between steps.
  useEffect(() => {
    let i = 4;
    const t = setInterval(() => {
      if (i >= 12) return clearInterval(t);
      const next = viewerChat[i % viewerChat.length];
      setComments((cs) => [...cs, { ...next, id: `${next.id}-${i}` }].slice(-6));
      setViewers((v) => v + ((i * 7) % 11) - 3);
      hearts.current?.burst(1);
      i++;
    }, 1600);
    return () => clearInterval(t);
  }, []);

  const like = () => {
    setLikes((l) => l + 3);
    hearts.current?.burst(4);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.text }} testID="screen-watch">
      <Image source={images[videoFor[c.id] ?? 'liveLena']} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient colors={['rgba(22,12,31,0.45)', 'transparent', 'transparent', 'rgba(22,12,31,0.7)']} locations={[0, 0.2, 0.5, 1]} style={StyleSheet.absoluteFill} />

      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <View style={styles.hostChip}>
          <Avatar img={c.avatar} size={32} />
          <T variant="label" numberOfLines={1} style={{ color: colors.white, fontFamily: font.semibold, flexShrink: 1 }}>{c.name}</T>
          <Pressable testID="watch-follow" accessibilityRole="button" accessibilityLabel={following ? 'Following, tap to unfollow' : 'Follow'} onPress={() => toggleFollow(c.id)} style={[styles.follow, following && styles.followed]}>
            {following ? <Icon name="check" size={16} color={colors.text} /> : <T variant="caption" style={{ color: colors.accentFill, fontFamily: font.semibold }}>Follow</T>}
          </Pressable>
        </View>
        <View style={{ flex: 1, minWidth: 4 }} />
        <LivePill />
        <ViewerPill count={viewers} exact={grouped(viewers)} />
        <IconButton icon="x" label="Close" color={colors.white} testID="watch-close" onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
      </View>
      <View style={[styles.hd, { top: insets.top + 56 }]}>
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.support }} />
        <T variant="caption" style={{ color: colors.white, fontFamily: font.semibold, fontSize: 12 }}>HD</T>
      </View>

      <View style={styles.rail}>
        <RailButton icon="heart" label={compact(likes)} onPress={like} testID="watch-like" />
        <RailButton icon="gift" label="Gift" onPress={() => setSheet(true)} testID="watch-gift-rail" />
        <RailButton icon="type" label={cc ? 'CC on' : 'CC'} onPress={() => setCc(!cc)} testID="watch-cc" active={cc} />
        <RailButton icon="share-2" label="Share" />
        <RailButton icon="more-horizontal" label="" onPress={() => setMore(!more)} testID="watch-more" />
      </View>
      <FloatingHearts ref={hearts} />
      {more ? (
        <View style={styles.moreMenu} testID="watch-more-menu">
          {(['Report stream', `Block ${c.name}`, 'Not interested'] as const).map((label) => (
            <Pressable key={label} onPress={() => { setReported(label); setMore(false); }} style={styles.moreItem}>
              <Icon name={label.startsWith('Report') ? 'flag' : label.startsWith('Block') ? 'slash' : 'eye-off'} size={16} color={label.startsWith('Not') ? colors.text : colors.danger} />
              <T variant="label" style={{ color: label.startsWith('Not') ? colors.text : colors.danger }}>{label}</T>
            </Pressable>
          ))}
        </View>
      ) : null}
      {reported ? (
        <Pressable onPress={() => setReported(null)} style={[styles.toast, { top: insets.top + 84 }]}>
          <Icon name="check-circle" size={16} color={colors.success} />
          <T variant="label" style={{ color: colors.text }}>{reported === 'Report stream' ? 'Thanks, our team will review this stream' : reported === 'Not interested' ? 'You will see fewer streams like this' : 'Creator blocked'}</T>
        </Pressable>
      ) : null}

      <View style={[styles.chat, { bottom: Math.max(insets.bottom, 12) + 72 }]} testID="watch-comments">
        {comments.map((m) => <CommentBubble key={m.id} c={m} />)}
        {cc ? (
          <View style={styles.caption} testID="live-caption">
            <T variant="caption" style={{ color: colors.support, fontFamily: font.bold, fontSize: 12 }}>LIVE CAPTIONS</T>
            <T variant="label" style={{ color: colors.white }}>{c.id === 'lena' ? '[guitar] "...and I will find my way back home tonight"' : '[music] Thanks for joining, everyone!'}</T>
          </View>
        ) : null}
      </View>

      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <View style={styles.inputPill}>
          <T variant="label" style={{ color: 'rgba(255,255,255,0.8)', flex: 1 }}>Say something...</T>
          <Icon name="smile" size={20} color={colors.white} />
        </View>
        <Pressable testID="watch-gift" accessibilityRole="button" accessibilityLabel="Send a gift" onPress={() => setSheet(true)} style={[styles.round, { backgroundColor: colors.support }]}>
          <Icon name="gift" size={22} color={colors.text} />
        </Pressable>
        <Pressable testID="watch-heart" accessibilityRole="button" accessibilityLabel="Send hearts" onPress={like} style={[styles.round, { backgroundColor: colors.accentFill }]}>
          <Icon name="heart" size={22} color={colors.white} />
        </Pressable>
      </View>

      {sheet ? (
        <GiftSheet
          to={c.name}
          onClose={() => setSheet(false)}
          onSent={(name, qty) => {
            setSheet(false);
            setComments((cs) => [...cs, { id: `me-${Date.now()}`, name: 'Maya', text: `sent a ${name} x${qty}`, kind: 'gift' as const }].slice(-6));
            hearts.current?.burst(6);
          }}
        />
      ) : null}
    </View>
  );
}

function RailButton({ icon, label, onPress, testID, active }: { icon: 'heart' | 'gift' | 'share-2' | 'more-horizontal' | 'type'; label: string; onPress?: () => void; testID?: string; active?: boolean }) {
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label || 'More'} accessibilityState={active === undefined ? undefined : { selected: active }} onPress={onPress} style={{ alignItems: 'center', gap: 2 }}>
      <View style={[styles.railBtn, active && { backgroundColor: colors.accentFill }]}><Icon name={icon} size={22} color={colors.white} /></View>
      {label ? <T variant="caption" style={{ color: colors.white, fontSize: 12, fontFamily: font.semibold }}>{label}</T> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 0, right: 0, top: 0, flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 12, paddingRight: 4 },
  hostChip: { flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.overlay, borderRadius: radius.pill, padding: 4, paddingRight: 4 },
  follow: { backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 10, height: 30, justifyContent: 'center' },
  followed: { backgroundColor: colors.support, width: 30, paddingHorizontal: 0, alignItems: 'center' },
  caption: { backgroundColor: colors.overlayStrong, borderRadius: radius.control, paddingHorizontal: 12, paddingVertical: 8, marginTop: 4 },
  moreMenu: { position: 'absolute', right: 64, top: '52%', backgroundColor: colors.surface, borderRadius: radius.control, paddingVertical: 4, minWidth: 190 },
  moreItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, height: 44 },
  toast: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 14, height: 44 },
  hd: { position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 8, height: 22 },
  rail: { position: 'absolute', right: 12, top: '34%', gap: 14, alignItems: 'center' },
  railBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center' },
  chat: { position: 'absolute', left: 12, right: 84, gap: 6 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12 },
  inputPill: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: radius.pill, backgroundColor: colors.overlay, paddingHorizontal: 16 },
  round: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
