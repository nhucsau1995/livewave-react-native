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

  // Simulated realtime: a new chat line and a viewer change every ~1.6 s, ambient hearts.
  useEffect(() => {
    let i = 4;
    const t = setInterval(() => {
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
          <T variant="label" numberOfLines={1} style={{ color: colors.white, fontFamily: font.semibold, maxWidth: 90 }}>{c.name}</T>
          <Pressable testID="watch-follow" accessibilityRole="button" onPress={() => toggleFollow(c.id)} style={[styles.follow, following && { backgroundColor: colors.overlay }]}>
            <T variant="caption" style={{ color: following ? colors.white : colors.accentFill, fontFamily: font.semibold }}>{following ? 'Following' : 'Follow'}</T>
          </Pressable>
        </View>
        <View style={{ flex: 1 }} />
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
        <RailButton icon="share-2" label="Share" />
        <RailButton icon="more-horizontal" label="" />
      </View>
      <FloatingHearts ref={hearts} />

      <View style={[styles.chat, { bottom: Math.max(insets.bottom, 12) + 72 }]} testID="watch-comments">
        {comments.map((m) => <CommentBubble key={m.id} c={m} />)}
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

function RailButton({ icon, label, onPress, testID }: { icon: 'heart' | 'gift' | 'share-2' | 'more-horizontal'; label: string; onPress?: () => void; testID?: string }) {
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label || 'More'} onPress={onPress} style={{ alignItems: 'center', gap: 2 }}>
      <View style={styles.railBtn}><Icon name={icon} size={22} color={colors.white} /></View>
      {label ? <T variant="caption" style={{ color: colors.white, fontSize: 12, fontFamily: font.semibold }}>{label}</T> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 0, right: 0, top: 0, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12 },
  hostChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.overlay, borderRadius: radius.pill, padding: 4, paddingRight: 4 },
  follow: { backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 12, height: 30, justifyContent: 'center' },
  hd: { position: 'absolute', right: 16, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 8, height: 22 },
  rail: { position: 'absolute', right: 12, top: '40%', gap: 16, alignItems: 'center' },
  railBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center' },
  chat: { position: 'absolute', left: 12, right: 84, gap: 6 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12 },
  inputPill: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: radius.pill, backgroundColor: colors.overlay, paddingHorizontal: 16 },
  round: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
