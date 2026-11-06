import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { Segmented, Toggle } from '../../components/Controls';
import { IconButton } from '../../components/Header';
import { Icon, type IconName } from '../../components/Icon';
import { StatusChip } from '../../components/Pills';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { images } from '../../data/images';
import type { Engine, Quality } from '../../data/models';
import { engineCaption } from '../../data/seed';
import { useApp } from '../../store';
import { colors, font, radius } from '../../theme/tokens';

const ENGINES = ['Agora', 'LiveKit', 'WebRTC'] as const;
const QUALITIES = ['480p', '720p', '1080p'] as const;
const CATS = ['Talk', 'Music', 'Cooking', 'Gaming'] as const;

export default function GoLiveSetup() {
  const settings = useApp((s) => s.settings);
  const startLive = useApp((s) => s.startLive);
  const [title, setTitle] = useState('Morning coffee and Q&A');
  const [category, setCategory] = useState<string>('Talk');
  const [engine, setEngine] = useState<Engine>(settings.defaultEngine);
  const [quality, setQuality] = useState<Quality>(settings.defaultQuality);
  const [adaptive, setAdaptive] = useState(settings.adaptiveBitrate);
  const [mic, setMic] = useState(true);

  const go = () => {
    startLive({ title: title.trim() || 'Untitled stream', category, engine, quality, adaptive });
    router.push('/host/live');
  };

  return (
    <Screen
      testID="screen-go-live"
      header={
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: -12 }}>
          <IconButton icon="x" label="Close" onPress={() => router.navigate('/home')} />
          <T variant="hero" style={{ flex: 1, fontSize: 28 }}>Go live</T>
          <IconButton icon="settings" label="Stream settings" testID="open-stream-settings" onPress={() => router.push('/settings')} />
        </View>
      }
      footer={<Button testID="go-live" label="Go Live" ion="radio-outline" onPress={go} />}
    >
      <View style={styles.preview}>
        <Image source={images.hostPreview} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.previewTag}><T variant="caption" style={{ color: colors.white, fontFamily: font.bold, fontSize: 12, letterSpacing: 1 }}>PREVIEW</T></View>
        <View style={styles.tools}>
          {(['refresh-cw', mic ? 'mic' : 'mic-off', 'star', 'sliders'] as IconName[]).map((ic, i) => (
            <IconButton key={i} icon={ic} label={ic} color={colors.white} onPress={i === 1 ? () => setMic(!mic) : undefined} />
          ))}
        </View>
        <View style={styles.camLabel}>
          <Icon name="video" size={14} color={colors.white} />
          <T variant="caption" style={{ color: colors.white, fontSize: 12 }}>HD front camera ({quality})</T>
        </View>
      </View>

      <T variant="label" style={{ color: colors.text2, marginTop: 16, marginBottom: 6 }}>Stream title</T>
      <View style={styles.input}>
        <TextInput testID="stream-title" value={title} onChangeText={setTitle} style={styles.inputText} placeholderTextColor={colors.text3} />
        <Icon name="edit-2" size={18} color={colors.text3} />
      </View>
      <T variant="label" style={{ color: colors.text2, marginTop: 14, marginBottom: 8 }}>Category</T>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {CATS.map((c) => <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />)}
      </View>

      <Card style={{ marginTop: 16 }}>
        <View style={styles.cardHead}>
          <T variant="label" bold style={{ flex: 1 }}>Streaming engine</T>
          <T variant="caption">RTC protocol</T>
        </View>
        <Segmented options={ENGINES} value={engine} onChange={setEngine} testPrefix="engine" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <Icon name="zap" size={14} color={colors.supportStrong} />
          <T variant="caption">{engineCaption[engine]}</T>
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <View style={styles.cardHead}>
          <T variant="label" bold style={{ flex: 1 }}>Quality</T>
          <T variant="caption">{settings.frameRate} FPS target</T>
        </View>
        <Segmented options={QUALITIES} value={quality} onChange={setQuality} testPrefix="quality" />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
          <View style={{ flex: 1 }}>
            <T variant="label" bold>Adaptive bitrate</T>
            <T variant="caption">Adjusts to connection drops</T>
          </View>
          <Toggle value={adaptive} onChange={setAdaptive} label="Adaptive bitrate" />
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <View style={styles.cardHead}>
          <T variant="label" bold style={{ flex: 1 }}>Pre-flight check</T>
          <StatusChip label="3/3 ready" tone="success" />
        </View>
        {[['Network - Good, 18 Mbps up', '42 ms'], ['Camera ready', 'Active'], ['Microphone ready', mic ? '-14 dB' : 'Muted']].map(([a, b]) => (
          <View key={a} style={styles.check}>
            <Icon name="check" size={18} color={colors.success} />
            <T variant="label" style={{ flex: 1 }}>{a}</T>
            <T variant="caption" style={{ color: colors.success, fontFamily: font.semibold }}>{b}</T>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: { height: 220, borderRadius: radius.card, overflow: 'hidden' },
  previewTag: { position: 'absolute', top: 12, left: 12, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 10, height: 24, justifyContent: 'center' },
  tools: { position: 'absolute', right: 6, top: 6, gap: 0 },
  camLabel: { position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 10, height: 26 },
  input: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.input, paddingHorizontal: 14, height: 52 },
  inputText: { flex: 1, fontFamily: font.regular, fontSize: 16, color: colors.text, paddingVertical: 0 },
  cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surfaceAlt, borderRadius: radius.control, paddingHorizontal: 12, height: 48, marginTop: 8 },
});
