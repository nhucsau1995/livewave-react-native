import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Icon, type IconName } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { topSupporters } from '../../data/seed';
import { grouped } from '../../logic/format';
import { average } from '../../logic/health';
import { coinsToUsd } from '../../logic/wallet';
import { useApp } from '../../store';
import { colors, font, radius, space } from '../../theme/tokens';

export default function LiveSummary() {
  const last = useApp((s) => s.lastSession);
  const { width } = useWindowDimensions();
  const [saved, setSaved] = useState(false);
  const tile = (width - space.edge * 2 - 12) / 2;
  const s = last ?? { title: 'Morning coffee and Q&A', seconds: 3120, peakViewers: 2940, totalViews: 8412, newFollowers: 186, commentCount: 1203, giftsEarned: 6450, latencySamples: [318] };
  const mins = Math.round(s.seconds / 60);
  const avgLatency = Math.round(average(s.latencySamples));

  const stats: [string, string, string, IconName][] = [
    ['Total views', grouped(s.totalViews), 'Unique sessions', 'eye'],
    ['New followers', `+${s.newFollowers}`, 'From this stream', 'user-plus'],
    ['Comments', grouped(s.commentCount), `${Math.round(s.commentCount / Math.max(1, mins))} msgs / min`, 'message-square'],
    ['Gifts earned', `${grouped(s.giftsEarned)}`, `coins - $${coinsToUsd(s.giftsEarned).toFixed(2)}`, 'gift'],
    ['Avg watch time', '7m 40s', '+1m 12s vs avg', 'clock'],
    ['Avg latency', `${avgLatency} ms`, 'Ultra low RTC', 'zap'],
  ];

  return (
    <Screen testID="screen-summary" header={<Header title="Stream summary" back="x" testID="summary-close" />}>
      <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.checkWrap}><Icon name="check" size={22} color={colors.white} /></View>
        <View style={{ flex: 1 }}>
          <T variant="title" style={{ color: colors.white }}>Stream ended</T>
          <T variant="label" style={{ color: colors.white }}>{s.title} - {mins} min</T>
        </View>
      </LinearGradient>

      <Card style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <T variant="caption">Peak viewers</T>
          <T variant="display" style={{ color: colors.accent }} testID="peak-viewers">{grouped(s.peakViewers)}</T>
          <T variant="caption">Highest concurrency at minute 38</T>
        </View>
        <View style={styles.trend}><Icon name="trending-up" size={22} color={colors.accent} /></View>
      </Card>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
        {stats.map(([l, v, n, ic]) => (
          <Card key={l} style={{ width: tile, padding: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <T variant="caption">{l}</T>
              <Icon name={ic} size={16} color={colors.accent} />
            </View>
            <T variant="title" style={{ fontFamily: font.bold, marginTop: 4, color: l === 'New followers' ? colors.success : colors.text }}>{v}</T>
            <T variant="caption" style={{ fontSize: 12, color: colors.text3 }}>{n}</T>
          </Card>
        ))}
      </View>

      <Card style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <T variant="label" bold style={{ flex: 1 }}>Top supporters</T>
          <T variant="caption" style={{ color: colors.accentFill }}>32 gifters</T>
        </View>
        {topSupporters.map((p, i) => (
          <View key={p.name} style={styles.sup}>
            <T variant="label" bold style={{ width: 18, color: colors.text3 }}>{i + 1}</T>
            <Avatar img={p.avatar} size={40} />
            <View style={{ flex: 1 }}>
              <T variant="label" bold>{p.name}</T>
              <T variant="caption">{p.note}</T>
            </View>
            <View style={styles.coins}><T variant="caption" style={{ color: colors.text, fontFamily: font.semibold }}>{grouped(p.coins)}</T></View>
          </View>
        ))}
      </Card>

      <Button testID="save-replay" icon={saved ? 'check' : 'download'} label={saved ? 'Replay saved' : 'Save replay'} onPress={() => setSaved(true)} style={{ marginTop: 16 }} />
      <Button kind="secondary" icon="share" label="Share highlights" style={{ marginTop: 10 }} />
      <T testID="back-home" variant="label" onPress={() => router.dismissTo('/home')} style={{ textAlign: 'center', color: colors.accentFill, fontFamily: font.semibold, marginTop: 12, paddingVertical: 10, textDecorationLine: 'underline' }}>Back to home</T>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.card, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  checkWrap: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  trend: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
  sup: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  coins: { backgroundColor: colors.support, borderRadius: radius.pill, paddingHorizontal: 10, height: 26, justifyContent: 'center' },
});
