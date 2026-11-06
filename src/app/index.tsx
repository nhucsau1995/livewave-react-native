import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { T } from '../components/Text';
import { images } from '../data/images';
import { useApp } from '../store';
import { colors, font, radius } from '../theme/tokens';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const signIn = useApp((s) => s.signIn);
  const go = (returning: boolean) => {
    signIn(returning);
    router.replace('/home');
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.text }} testID="screen-welcome">
      <Image source={images.heroWelcome} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient colors={['rgba(22,12,31,0.05)', 'rgba(125,66,175,0.55)', 'rgba(22,12,31,0.96)']} locations={[0.25, 0.55, 0.82]} style={StyleSheet.absoluteFill} />
      <View style={[styles.logoWrap, { top: insets.top + 16 }]}>
        <Image source={images.logo} style={{ width: 44, height: 44, borderRadius: 14 }} />
      </View>
      <View style={styles.liveNow}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.live }} />
        <T variant="caption" style={{ color: colors.white, fontFamily: font.semibold }}>14.8K live now</T>
      </View>
      <View style={[styles.bottom, { paddingBottom: Math.max(insets.bottom, 20) + 8 }]}>
        <View style={styles.dots}>
          <View style={[styles.dot, { width: 22, backgroundColor: colors.white }]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <T variant="hero" style={{ color: colors.white, textAlign: 'center' }}>Go live in seconds</T>
        <T variant="body" style={{ color: colors.white, textAlign: 'center', marginTop: 8, opacity: 0.92 }}>Stream, chat and earn with your community in real time.</T>
        <Button testID="get-started" label="Get started" onPress={() => go(false)} style={{ marginTop: 28, alignSelf: 'stretch' }} />
        <T testID="have-account" variant="label" onPress={() => go(true)} style={{ color: colors.white, textAlign: 'center', marginTop: 18, paddingVertical: 8, fontFamily: font.semibold }}>I already have an account</T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logoWrap: { position: 'absolute', alignSelf: 'center' },
  liveNow: { position: 'absolute', top: '44%', left: 20, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 12, height: 30 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20 },
  dots: { flexDirection: 'row', gap: 6, alignSelf: 'center', marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.45)' },
});
