import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { images } from '../data/images';
import type { Stream } from '../data/models';
import { creators } from '../data/seed';
import { colors, radius } from '../theme/tokens';
import { LivePill, ViewerPill } from './Pills';
import { ScalePressable } from './Pressable';
import { T } from './Text';

// Shared stream card: photo thumb, LIVE pill top-left, viewer pill top-right, title + creator.
export function StreamCard({ stream, width, height = 120, testID }: { stream: Stream; width: number; height?: number; testID?: string }) {
  const creator = creators.find((c) => c.id === stream.creatorId);
  return (
    <ScalePressable testID={testID} accessibilityRole="button" accessibilityLabel={stream.title} onPress={() => router.push(`/watch/${stream.creatorId}`)} containerStyle={{ width }}>
      <View style={{ width, height, borderRadius: radius.card, overflow: 'hidden' }}>
        <Image source={images[stream.thumb]} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.top}>
          <LivePill small />
          <ViewerPill count={stream.viewers} />
        </View>
      </View>
      <T variant="label" bold numberOfLines={1} style={{ marginTop: 8 }}>{stream.title}</T>
      <T variant="caption" numberOfLines={1}>{creator?.name}</T>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between' },
});
