import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { IconButton, SectionTitle } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { ScalePressable } from '../../components/Pressable';
import { Screen } from '../../components/Screen';
import { StreamCard } from '../../components/StreamCard';
import { T } from '../../components/Text';
import { images } from '../../data/images';
import { categories, creators, liveNow, topCategories, trending } from '../../data/seed';
import { compact } from '../../logic/format';
import { useApp } from '../../store';
import { colors, font, radius, space } from '../../theme/tokens';

export default function Explore() {
  const [cat, setCat] = useState<string>('All');
  const [q, setQ] = useState('');
  const following = useApp((s) => s.following);
  const toggleFollow = useApp((s) => s.toggleFollow);
  const { width } = useWindowDimensions();
  const col = (width - space.edge * 2 - 12) / 2;

  const pool = [...trending, ...liveNow];
  const term = q.trim().toLowerCase();
  const shown = pool.filter((s) => (cat === 'All' || s.category === cat) && (!term || s.title.toLowerCase().includes(term) || creators.find((c) => c.id === s.creatorId)?.name.toLowerCase().includes(term)));
  const rising = creators.filter((c) => ['lena', 'aiko', 'marco'].includes(c.id));

  return (
    <Screen testID="screen-explore">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T variant="hero">Explore</T>
        <IconButton icon="bell" label="Notifications" />
      </View>
      <View style={styles.search}>
        <Icon name="search" size={20} color={colors.text3} />
        <TextInput testID="search" value={q} onChangeText={setQ} placeholder="Search creators, streams, tags" placeholderTextColor={colors.text3} style={styles.input} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.edge, marginTop: 16 }} contentContainerStyle={{ gap: 8, paddingHorizontal: space.edge }}>
        {categories.map((c) => <Chip key={c} label={c} active={cat === c} onPress={() => setCat(c)} testID={`cat-${c}`} />)}
      </ScrollView>

      <SectionTitle title="Trending" action="View all" />
      {shown.length === 0 ? (
        <T variant="body" style={{ color: colors.text2 }}>No live streams in {cat} right now.</T>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -space.edge }} contentContainerStyle={{ gap: 12, paddingHorizontal: space.edge }}>
          {shown.map((s) => <StreamCard key={s.id} stream={s} width={170} height={226} testID={`trend-${s.id}`} />)}
        </ScrollView>
      )}

      <SectionTitle title="Top categories" action="See all" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {topCategories.map((t) => (
          <View key={t.name} style={{ width: col, height: col * 0.78, borderRadius: radius.card, overflow: 'hidden' }}>
            <Image source={images[t.thumb]} style={StyleSheet.absoluteFill} resizeMode="cover" />
            <LinearGradient colors={['transparent', 'rgba(22,12,31,0.8)']} style={StyleSheet.absoluteFill} />
            <View style={styles.countPill}><T variant="caption" style={{ color: colors.text, fontFamily: font.semibold, fontSize: 12 }}>{t.live}</T></View>
            <T variant="title" style={{ color: colors.white, position: 'absolute', left: 12, bottom: 10 }}>{t.name}</T>
          </View>
        ))}
      </View>

      <SectionTitle title="Rising creators" />
      <View style={{ gap: 10 }}>
        {rising.map((c) => {
          const on = following.includes(c.id);
          return (
            <Card key={c.id} style={{ padding: 0 }}>
              <View style={styles.row}>
                <ScalePressable containerStyle={{ flex: 1 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }} testID={`rising-${c.id}`} accessibilityRole="button" accessibilityLabel={c.name} onPress={() => router.push(`/creator/${c.id}`)}>
                  <Avatar img={c.avatar} size={48} />
                  <View style={{ flex: 1 }}>
                    <T variant="label" bold>{c.name}</T>
                    <T variant="caption" numberOfLines={1}>{c.category} - {compact(c.followers)} followers</T>
                  </View>
                </ScalePressable>
                <Button small kind={on ? 'primary' : 'secondary'} label={on ? 'Following' : 'Follow'} onPress={() => toggleFollow(c.id)} testID={`rfollow-${c.id}`} />
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.input, paddingHorizontal: 14, height: 48, marginTop: 16 },
  input: { flex: 1, fontFamily: font.regular, fontSize: 16, color: colors.text, paddingVertical: 0 },
  countPill: { position: 'absolute', top: 10, left: 10, backgroundColor: colors.support, borderRadius: radius.pill, paddingHorizontal: 8, height: 22, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
});
