import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { CommentBubble } from '../../components/CommentBubble';
import { Icon, type IconName } from '../../components/Icon';
import { LivePill, ViewerPill } from '../../components/Pills';
import { T } from '../../components/Text';
import { images } from '../../data/images';
import type { Comment } from '../../data/models';
import { clock, grouped } from '../../logic/format';
import { classify } from '../../logic/health';
import { useApp } from '../../store';
import { colors, font, radius } from '../../theme/tokens';

export default function HostLive() {
  const insets = useSafeAreaInsets();
  const session = useApp((s) => s.session);
  const moderate = useApp((s) => s.moderate);
  const endLive = useApp((s) => s.endLive);
  const debug = useApp((s) => s.settings.debugOverlay);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [mic, setMic] = useState(true);
  const [alert, setAlert] = useState<Comment | null>({ id: 'g0', name: 'Sofia', text: 'sent a Crown x1 +500', kind: 'gift', avatar: 'avatarSofia' });
  const slide = useRef(new Animated.Value(0)).current;
  const lastGift = session?.comments.filter((c) => c.kind === 'gift').slice(-1)[0];

  useEffect(() => {
    if (lastGift) setAlert(lastGift);
  }, [lastGift?.id]);

  useEffect(() => {
    if (!alert) return;
    slide.setValue(0);
    Animated.spring(slide, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 8 }).start();
    const t = setTimeout(() => setAlert(null), 4000);
    return () => clearTimeout(t);
  }, [alert?.id]);

  if (!session) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <T variant="body">No live session.</T>
        <T variant="label" style={{ color: colors.accentFill, marginTop: 8 }} onPress={() => router.replace('/golive')}>Set up a stream</T>
      </View>
    );
  }

  const b = session.bitrate[session.bitrate.length - 1];
  const level = session.reconnecting ? 'Reconnecting' : classify({ bitrateKbps: b, fps: session.fps, latencyMs: session.latency, packetLoss: session.packetLoss });
  const dot = level === 'Excellent' ? colors.support : level === 'Good' ? '#F5C26B' : colors.live;
  const pinned = session.comments.find((c) => c.pinned);
  const rest = session.comments.filter((c) => !c.pinned).slice(-4);

  const end = () => {
    endLive();
    router.replace('/host/summary');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.text }} testID="screen-host-live">
      <Image source={images.liveHostCoffee} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient colors={['rgba(22,12,31,0.5)', 'transparent', 'transparent', 'rgba(22,12,31,0.75)']} locations={[0, 0.2, 0.45, 1]} style={StyleSheet.absoluteFill} />

      <View style={[styles.top, { paddingTop: insets.top + 8 }]}>
        <View style={styles.timer}>
          <LivePill />
          <T variant="label" style={{ color: colors.white, fontFamily: font.semibold, fontVariant: ['tabular-nums'] }} testID="live-timer">{clock(session.seconds)}</T>
        </View>
        <View style={{ flex: 1 }} />
        <ViewerPill count={session.viewers} exact={grouped(session.viewers)} />
        <Pressable testID="end-stream" accessibilityRole="button" accessibilityLabel="End stream" onPress={end} style={styles.end}>
          <T variant="label" style={{ color: colors.white, fontFamily: font.bold }}>End</T>
        </Pressable>
      </View>
      <View style={[styles.subTop, { top: insets.top + 50 }]}>
        <Pressable testID="health-chip" onPress={() => router.push('/host/health')} style={styles.chip}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: dot }} />
          <T variant="caption" style={{ color: colors.white, fontSize: 12 }}>{level} - {(b / 1000).toFixed(1)} Mbps</T>
        </Pressable>
        <View style={styles.chip}>
          <T variant="caption" style={{ color: colors.white, fontSize: 12 }}>{session.engine} - {session.quality}</T>
        </View>
      </View>
      {debug ? (
        <View style={[styles.debug, { top: insets.top + 84 }]}>
          <T variant="caption" style={{ color: colors.support, fontSize: 12 }}>{`br ${b} kbps  fps ${session.fps}\nrtt ${session.latency} ms  loss ${session.packetLoss}%`}</T>
        </View>
      ) : null}

      {alert ? (
        <Animated.View style={[styles.alert, { opacity: slide, transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] }) }] }]}>
          <View style={styles.alertIcon}><Icon name="award" size={18} color={colors.white} /></View>
          <View>
            <T variant="label" style={{ color: colors.text, fontFamily: font.bold }}>{alert.name}</T>
            <T variant="caption" style={{ color: colors.text }}>{alert.text.replace('sent a ', '')}</T>
          </View>
        </Animated.View>
      ) : null}

      {showChat ? (
        <View style={[styles.chat, { bottom: Math.max(insets.bottom, 12) + 76 }]}>
          {pinned ? (
            <View style={styles.pinned}>
              <Icon name="bookmark" size={16} color={colors.support} />
              <View style={{ flex: 1 }}>
                <T variant="caption" style={{ color: colors.support, fontSize: 12 }}>Pinned - {pinned.name}</T>
                <T variant="label" style={{ color: colors.white }}>{pinned.text}</T>
              </View>
            </View>
          ) : null}
          {rest.map((c) => (
            <View key={c.id}>
              <Pressable testID={`comment-${c.id}`} onLongPress={() => setMenuFor(menuFor === c.id ? null : c.id)} delayLongPress={300}>
                <CommentBubble c={c} />
              </Pressable>
              {menuFor === c.id ? (
                <View style={styles.menu}>
                  {([['bookmark', 'Pin', 'pin'], ['volume-x', 'Mute', 'mute'], ['trash-2', 'Remove', 'remove']] as const).map(([ic, label, act]) => (
                    <Pressable key={act} testID={`mod-${act}`} onPress={() => { moderate(c.id, act); setMenuFor(null); }} style={styles.menuItem}>
                      <Icon name={ic} size={14} color={act === 'remove' ? colors.danger : colors.text} />
                      <T variant="caption" style={{ color: act === 'remove' ? colors.danger : colors.text, fontFamily: font.semibold }}>{label}</T>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
          <T variant="caption" style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Long-press a comment to pin, mute or remove</T>
        </View>
      ) : null}

      <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <Ctl icon={mic ? 'mic' : 'mic-off'} label="Microphone" onPress={() => setMic(!mic)} />
        <Ctl icon="refresh-cw" label="Flip camera" />
        <Ctl icon="star" label="Beauty" />
        <Ctl icon="activity" label="Stream health" testID="open-health" onPress={() => router.push('/host/health')} />
        <Ctl icon="message-square" label="Comments" active={showChat} onPress={() => setShowChat(!showChat)} />
      </View>
    </View>
  );
}

function Ctl({ icon, label, onPress, testID, active }: { icon: IconName; label: string; onPress?: () => void; testID?: string; active?: boolean }) {
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={[styles.ctl, active && { backgroundColor: colors.accentFill }]}>
      <Icon name={icon} size={22} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 0, right: 0, top: 0, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.overlay, borderRadius: radius.pill, padding: 4, paddingRight: 12 },
  end: { backgroundColor: colors.live, borderRadius: radius.pill, paddingHorizontal: 16, height: 36, justifyContent: 'center' },
  subTop: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 10, height: 26 },
  debug: { position: 'absolute', right: 12, backgroundColor: colors.overlayStrong, borderRadius: 10, padding: 8 },
  alert: { position: 'absolute', left: 12, top: '34%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.support, borderRadius: radius.pill, paddingVertical: 8, paddingLeft: 8, paddingRight: 18 },
  alertIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  chat: { position: 'absolute', left: 12, right: 60, gap: 6 },
  pinned: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.overlayStrong, borderRadius: radius.control, borderWidth: 1, borderColor: 'rgba(168,214,114,0.5)', padding: 10 },
  menu: { flexDirection: 'row', gap: 6, marginTop: 6 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 12, height: 36 },
  controls: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 12 },
  ctl: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center' },
});
