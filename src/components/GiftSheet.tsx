import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { gifts } from '../data/seed';
import { grouped } from '../logic/format';
import { canAfford, giftTotal } from '../logic/wallet';
import { useApp } from '../store';
import { colors, font, radius } from '../theme/tokens';
import { Button } from './Button';
import { Icon, Ion, type IonName } from './Icon';
import { T } from './Text';

const QTY = [1, 5, 10] as const;

export function CoinChip({ coins }: { coins: number }) {
  return (
    <View style={styles.coinChip}>
      <View style={styles.coin}><T variant="caption" style={{ color: colors.text, fontFamily: font.bold, fontSize: 12, lineHeight: 14 }}>c</T></View>
      <T variant="caption" style={{ color: colors.success, fontFamily: font.semibold }}>{grouped(coins)} coins</T>
    </View>
  );
}

// Bottom sheet over the dimmed video: 4x2 gift grid, quantity, send.
export function GiftSheet({ to, onClose, onSent }: { to: string; onClose: () => void; onSent: (name: string, qty: number) => void }) {
  const insets = useSafeAreaInsets();
  const coins = useApp((s) => s.coins);
  const sendGift = useApp((s) => s.sendGift);
  const [sel, setSel] = useState('rocket');
  const [qty, setQty] = useState<(typeof QTY)[number]>(1);
  const gift = gifts.find((g) => g.id === sel)!;
  const ok = canAfford(coins, gift.price, qty);

  return (
    <View style={StyleSheet.absoluteFill} testID="gift-sheet">
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(22,12,31,0.45)' }]} onPress={onClose} accessibilityLabel="Close gifts" />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <View style={styles.grabber} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <T variant="title" style={{ flex: 1 }}>Send a gift</T>
          <CoinChip coins={coins} />
          <T variant="label" onPress={() => { onClose(); router.push('/wallet'); }} style={{ color: colors.accentFill, fontFamily: font.semibold }}>Top up</T>
        </View>
        <View style={styles.grid}>
          {gifts.map((g) => {
            const on = g.id === sel;
            return (
              <Pressable key={g.id} testID={`gift-${g.id}`} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={`${g.name}, ${g.price} coins`} onPress={() => setSel(g.id)} style={[styles.cell, on && styles.cellOn]}>
                {on ? <View style={styles.check}><Icon name="check" size={12} color={colors.white} /></View> : null}
                <Ion name={g.icon as IonName} size={28} color={colors.accent} />
                <T variant="caption" style={{ color: colors.text, marginTop: 4 }}>{g.name}</T>
                <T variant="caption" style={{ color: colors.success, fontFamily: font.semibold, fontSize: 12 }}>{g.price}</T>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <T variant="label" style={{ flex: 1, color: colors.text2 }}>Quantity</T>
          <View style={styles.qtyRow}>
            {QTY.map((q) => (
              <Pressable key={q} testID={`qty-${q}`} accessibilityRole="button" accessibilityState={{ selected: q === qty }} onPress={() => setQty(q)} style={[styles.qty, q === qty && { backgroundColor: colors.surface }]}>
                <T variant="label" style={{ color: q === qty ? colors.accentFill : colors.text2, fontFamily: font.semibold }}>x{q}</T>
              </Pressable>
            ))}
          </View>
        </View>
        <Button
          testID="send-gift"
          disabled={!ok}
          label={ok ? `Send ${gift.name} - ${grouped(giftTotal(gift.price, qty))} coins` : 'Not enough coins'}
          onPress={() => {
            if (sendGift(gift.id, qty, to)) onSent(gift.name, qty);
          }}
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: 20, paddingTop: 10 },
  grabber: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14 },
  coinChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.successTint, borderRadius: radius.pill, paddingHorizontal: 10, height: 30 },
  coin: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.support, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  cell: { width: '22.6%', alignItems: 'center', paddingVertical: 12, borderRadius: radius.control, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  cellOn: { borderColor: colors.accent, backgroundColor: colors.accentTint },
  check: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.accentFill, alignItems: 'center', justifyContent: 'center' },
  qtyRow: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, padding: 4 },
  qty: { paddingHorizontal: 16, height: 36, borderRadius: radius.pill, justifyContent: 'center' },
});
