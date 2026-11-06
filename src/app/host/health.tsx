import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Toggle } from '../../components/Controls';
import { Header } from '../../components/Header';
import { Icon, type IconName } from '../../components/Icon';
import { LineChart } from '../../components/LineChart';
import { StatusChip } from '../../components/Pills';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { classify, qualityTargetKbps } from '../../logic/health';
import { useApp } from '../../store';
import { colors, font, radius, space } from '../../theme/tokens';

const regions: Record<string, string> = { Agora: 'Singapore (ap-southeast-1)', LiveKit: 'Singapore SFU', WebRTC: 'Peer, TURN Singapore' };

export default function StreamHealth() {
  const session = useApp((s) => s.session);
  const debug = useApp((s) => s.settings.debugOverlay);
  const setSetting = useApp((s) => s.setSetting);
  const simulateDrop = useApp((s) => s.simulateDrop);
  const { width } = useWindowDimensions();
  const [exported, setExported] = useState(false);

  if (!session) {
    return (
      <Screen header={<Header title="Stream health" />}>
        <T variant="body">Go live to see stream diagnostics.</T>
      </Screen>
    );
  }

  const b = session.bitrate[session.bitrate.length - 1];
  const target = qualityTargetKbps[session.quality];
  const level = classify({ bitrateKbps: b, fps: session.fps, latencyMs: session.latency, packetLoss: session.packetLoss }, target);
  const status = session.reconnecting ? (['Reconnecting', 'warning'] as const) : level === 'Poor' ? (['Unstable', 'danger'] as const) : (['Stable', 'success'] as const);
  const tile = (width - space.edge * 2 - 12) / 2;
  const res = { '480p': '854 x 480', '720p': '1280 x 720', '1080p': '1920 x 1080' }[session.quality];

  return (
    <Screen testID="screen-health" header={<Header title="Stream health" right={<StatusChip label={status[0]} tone={status[1]} />} />}>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T variant="label" style={{ color: colors.text2 }}>Upload bitrate</T>
          <StatusChip label={`Target ${(target / 1000).toFixed(1)} Mbps`} tone="success" />
        </View>
        <T variant="display" style={{ color: colors.accent, marginTop: 4 }} testID="bitrate">{(b / 1000).toFixed(1)} Mbps</T>
        <View style={{ marginTop: 8 }}>
          <LineChart data={session.bitrate} target={target} width={width - space.edge * 2 - 32} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          {['-60s', '-45s', '-30s', '-15s', 'now'].map((l) => <T key={l} variant="caption" style={{ fontSize: 12, color: l === 'now' ? colors.accentFill : colors.text3 }}>{l}</T>)}
        </View>
      </Card>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
        <Metric w={tile} label="FPS" icon="film" value={String(session.fps)} unit="fps" note={`Target ${session.fps}`} ok />
        <Metric w={tile} label="Latency" icon="clock" value={String(session.latency)} unit="ms" note={session.latency < 450 ? 'Ultra low' : 'High'} ok={session.latency < 450} />
        <Metric w={tile} label="Packet loss" icon="shield" value={session.packetLoss.toFixed(1)} unit="%" note={session.packetLoss < 1.5 ? 'Optimal' : 'Degraded'} ok={session.packetLoss < 1.5} />
        <Metric w={tile} label="Resolution" icon="monitor" value={session.quality} unit="" note={res} ok />
      </View>

      <Card style={{ marginTop: 12 }}>
        <T variant="label" bold style={{ marginBottom: 6 }}>Connection details</T>
        {[['RTC engine', `${session.engine} RTC`], ['Edge region', regions[session.engine]], ['Network link', 'Wi-Fi (5 GHz)'], ['Encoder', 'H.264 hardware']].map(([k, v]) => (
          <View key={k} style={styles.kv}>
            <T variant="label" style={{ color: colors.text2 }}>{k}</T>
            <T variant="label" bold>{v}</T>
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: 12 }} testID="reconnect-log">
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <T variant="label" bold style={{ flex: 1 }}>Reconnect log</T>
          <T variant="caption">{session.reconnectLog.filter((e) => e.kind === 'warning').length} drop(s) today</T>
        </View>
        {session.reconnectLog.slice(-6).map((e, i, arr) => {
          const tone = e.kind === 'warning' ? colors.warning : e.kind === 'success' ? colors.success : colors.accentFill;
          const ic: IconName = e.kind === 'warning' ? 'alert-triangle' : e.kind === 'success' ? 'check-circle' : 'rotate-cw';
          return (
            <View key={e.id} style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ alignItems: 'center' }}>
                <Icon name={ic} size={18} color={tone} />
                {i < arr.length - 1 ? <View style={{ width: 1.5, flex: 1, backgroundColor: colors.border, marginVertical: 2 }} /> : null}
              </View>
              <View style={{ flex: 1, paddingBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T variant="label" bold style={{ color: e.kind === 'success' ? colors.success : colors.text, flex: 1 }}>{e.title}</T>
                  <T variant="caption" style={{ fontVariant: ['tabular-nums'] }}>{e.at}</T>
                </View>
                <T variant="caption">{e.detail}</T>
              </View>
            </View>
          );
        })}
        <Button testID="simulate-drop" small kind="secondary" icon="wifi-off" label={session.reconnecting ? 'Reconnecting...' : 'Simulate network drop'} disabled={session.reconnecting} onPress={simulateDrop} />
      </Card>

      <Card style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <T variant="label" bold>Show debug overlay on video</T>
          <T variant="caption">Real-time stats on the host view</T>
        </View>
        <Toggle testID="toggle-debug" label="Debug overlay" value={debug} onChange={(v) => setSetting('debugOverlay', v)} />
      </Card>

      <Button kind="secondary" icon={exported ? 'check' : 'download'} label={exported ? 'Report saved (session.json)' : 'Export diagnostic report (.json)'} onPress={() => setExported(true)} style={{ marginTop: 16 }} />
      <T variant="caption" style={{ textAlign: 'center', marginTop: 10 }}>Session lw-7839-sg - node 148</T>
      <T variant="label" onPress={() => router.back()} style={{ textAlign: 'center', color: colors.accentFill, fontFamily: font.semibold, marginTop: 8, paddingVertical: 8 }}>Back to stream</T>
    </Screen>
  );
}

function Metric({ w, label, icon, value, unit, note, ok }: { w: number; label: string; icon: IconName; value: string; unit: string; note: string; ok: boolean }) {
  return (
    <Card style={{ width: w, padding: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T variant="caption">{label}</T>
        <View style={styles.mIcon}><Icon name={icon} size={14} color={colors.accent} /></View>
      </View>
      <T variant="title" style={{ fontFamily: font.bold, marginTop: 4, fontVariant: ['tabular-nums'] }}>{value} <T variant="caption">{unit}</T></T>
      <View style={[styles.note, { backgroundColor: ok ? colors.successTint : colors.warningTint }]}>
        <T variant="caption" style={{ fontSize: 12, color: ok ? colors.success : colors.warning, fontFamily: font.semibold }}>{note}</T>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  kv: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  mIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
  note: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 8, height: 22, justifyContent: 'center', marginTop: 6 },
});
