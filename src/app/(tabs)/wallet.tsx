import { useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/Card';
import { IconButton, SectionTitle } from '../../components/Header';
import { Icon, type IconName } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { coinPacks } from '../../data/seed';
import { grouped, money } from '../../logic/format';
import { useApp } from '../../store';
import { colors, font, radius, space } from '../../theme/tokens';

export default function Wallet() {
  const coins = useApp((s) => s.coins);
  const earnings = useApp((s) => s.earningsUsd);
  const activity = useApp((s) => s.activity);
  const topUp = useApp((s) => s.topUp);
  const { width } = useWindowDimensions();
  const [bought, setBought] = useState<string | null>(null);
  const col = (width - space.edge * 2 - 12) / 2;

  return (
    <Screen testID="screen-wallet">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T variant="hero">Wallet</T>
        <IconButton icon="file-text" label="Statements" />
      </View>
      <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balance}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T variant="label" style={{ color: colors.white }}>Coin balance</T>
          <View style={styles.sync}><View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.support }} /><T variant="caption" style={{ color: colors.white, fontSize: 12 }}>Live sync</T></View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <T variant="display" style={{ color: colors.white }} testID="coin-balance">{grouped(coins)}</T>
          <View style={styles.coin}><Icon name="disc" size={16} color={colors.text} /></View>
        </View>
        <View style={styles.divider} />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <T variant="caption" style={{ color: colors.white }}>Earnings this month</T>
            <T variant="title" style={{ color: colors.white }}>{money(earnings)}</T>
          </View>
          <View style={styles.withdraw}><T variant="label" style={{ color: colors.white, fontFamily: font.semibold }}>Withdraw</T><Icon name="chevron-right" size={16} color={colors.white} /></View>
        </View>
      </LinearGradient>

      <SectionTitle title="Top up" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {coinPacks.map((p) => (
          <Pressable key={p.id} testID={`pack-${p.id}`} accessibilityRole="button" accessibilityLabel={`${p.coins} coins for ${money(p.price)}`} onPress={() => { topUp(p.id); setBought(p.id); }}>
            <Card style={[styles.pack, { width: col }, p.popular && { borderWidth: 1.5, borderColor: colors.accent }]}>
              {p.popular ? <View style={styles.popular}><T variant="caption" style={{ color: colors.text, fontFamily: font.bold, fontSize: 12 }}>POPULAR</T></View> : null}
              <View style={styles.packIcon}><Icon name={bought === p.id ? 'check' : 'disc'} size={18} color={colors.accent} /></View>
              <T variant="label" bold style={{ marginTop: 6 }}>{grouped(p.coins)} coins</T>
              <View style={styles.price}><T variant="label" style={{ color: colors.white, fontFamily: font.semibold }}>{money(p.price)}</T></View>
            </Card>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="Recent activity" action="See all" />
      <Card style={{ paddingVertical: 4 }}>
        {activity.slice(0, 5).map((a, i) => (
          <View key={a.id} style={[styles.act, i > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
            <View style={styles.actIcon}><Icon name={a.icon as IconName} size={18} color={colors.accent} /></View>
            <T variant="label" style={{ flex: 1 }}>{a.label}</T>
            <T variant="label" bold style={{ color: a.amount < 0 ? colors.text : colors.success }}>{a.amount > 0 ? '+' : ''}{grouped(a.amount)}</T>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  balance: { borderRadius: radius.card, padding: 18, marginTop: 16 },
  sync: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(22,12,31,0.25)', borderRadius: radius.pill, paddingHorizontal: 10, height: 24 },
  coin: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.support, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 14 },
  withdraw: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(22,12,31,0.3)', borderRadius: radius.pill, paddingHorizontal: 14, height: 40 },
  pack: { alignItems: 'center', paddingVertical: 14 },
  popular: { position: 'absolute', top: -10, backgroundColor: colors.support, borderRadius: radius.pill, paddingHorizontal: 10, height: 20, justifyContent: 'center' },
  packIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
  price: { backgroundColor: colors.accentFill, borderRadius: radius.pill, alignSelf: 'stretch', alignItems: 'center', height: 34, justifyContent: 'center', marginTop: 8 },
  act: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  actIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
});
