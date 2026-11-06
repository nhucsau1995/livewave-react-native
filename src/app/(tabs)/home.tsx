import { router } from 'expo-router';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { IconButton, SectionTitle } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { LivePill, ViewerPill } from '../../components/Pills';
import { ScalePressable } from '../../components/Pressable';
import { Screen } from '../../components/Screen';
import { StreamCard } from '../../components/StreamCard';
import { T } from '../../components/Text';
import { images } from '../../data/images';
import { creators, featured, liveNow, me } from '../../data/seed';
import { compact } from '../../logic/format';
import { useApp } from '../../store';
import { colors, font, radius, space } from '../../theme/tokens';

function HomeHeader() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Avatar img="avatarMaya" size={40} />
      <T variant="title" style={{ flex: 1 }}>Hi, {me.first}</T>
      <IconButton icon="search" label="Search" onPress={() => router.push('/explore')} />
      <View>
        <IconButton icon="bell" label="Notifications" />
        <View style={{ position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.live }} />
      </View>
    </View>
  );
}

export default function Home() {
  const following = useApp((s) => s.following);
  const toggleFollow = useApp((s) => s.toggleFollow);
  const { width } = useWindowDimensions();
  const col = (width - space.edge * 2 - 12) / 2;
  const followed = creators.filter((c) => following.includes(c.id));

  if (followed.length === 0) {
    const suggested = creators.filter((c) => ['lena', 'aiko', 'sam'].includes(c.id));
    return (
      <Screen testID="screen-home-empty" header={<HomeHeader />}>
        <Card style={{ padding: 12, marginTop: 8 }}>
          <View style={{ height: 190, borderRadius: 16, overflow: 'hidden' }}>
            <Image source={images.emptyStudioDesk} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <View style={styles.offline}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white }} />
              <T variant="caption" style={{ color: colors.white, fontFamily: font.semibold }}>Studio offline</T>
            </View>
          </View>
          <T variant="title" style={{ textAlign: 'center', marginTop: 16 }}>Nobody you follow is live</T>
          <T variant="body" style={{ textAlign: 'center', color: colors.text2, marginTop: 6, paddingHorizontal: 12 }}>Follow creators to get notified when they go live.</T>
          <Button testID="explore-live" label="Explore live streams" icon="compass" onPress={() => router.push('/explore')} style={{ marginTop: 16, marginBottom: 4 }} />
        </Card>
        <SectionTitle title="Suggested creators" />
        <View style={{ gap: 10 }}>
          {suggested.map((c) => (
            <Card key={c.id} style={styles.row}>
              <Avatar img={c.avatar} size={48} />
              <View style={{ flex: 1 }}>
                <T variant="label" bold>{c.name}</T>
                <T variant="caption">{c.category} - {compact(c.followers)} followers</T>
              </View>
              <Button small kind="secondary" testID={`follow-${c.id}`} label="Follow" onPress={() => toggleFollow(c.id)} />
            </Card>
          ))}
        </View>
      </Screen>
    );
  }

  const kairo = creators.find((c) => c.id === featured.creatorId)!;
  return (
    <Screen testID="screen-home" header={<HomeHeader />}>
      <ScalePressable testID="featured-stream" accessibilityRole="button" accessibilityLabel={featured.title} onPress={() => router.push(`/watch/${featured.creatorId}`)}>
        <View style={styles.featured}>
          <Image source={images[featured.thumb]} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(22,12,31,0.85)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
          <View style={styles.cardTop}><LivePill /><ViewerPill count={featured.viewers} /></View>
          <View style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
            <T variant="title" style={{ color: colors.white }}>{featured.title}</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Avatar img={kairo.avatar} size={22} />
              <T variant="caption" style={{ color: colors.white }}>{kairo.name}</T>
              <Icon name="check-circle" size={13} color={colors.white} />
            </View>
          </View>
        </View>
      </ScalePressable>

      <SectionTitle title="Following - live now" />
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {followed.map((c) => (
          <ScalePressable key={c.id} testID={`following-${c.id}`} accessibilityRole="button" accessibilityLabel={`Watch ${c.name}`} onPress={() => router.push(`/watch/${c.id}`)} style={{ alignItems: 'center', width: 70 }}>
            <Avatar img={c.avatar} size={64} ring />
            <View style={{ marginTop: -10 }}><LivePill small /></View>
            <T variant="caption" numberOfLines={1} style={{ color: colors.text, marginTop: 4 }}>{c.name}</T>
          </ScalePressable>
        ))}
      </View>

      <SectionTitle title="Live now" action="See all" onAction={() => router.push('/explore')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {liveNow.map((s) => <StreamCard key={s.id} stream={s} width={col} height={col * 0.78} testID={`card-${s.id}`} />)}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  offline: { position: 'absolute', left: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 10, height: 26 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  featured: { height: 200, borderRadius: radius.card, overflow: 'hidden', marginTop: 8 },
  cardTop: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
});
