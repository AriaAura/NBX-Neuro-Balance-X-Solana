import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { MODULES, useStreak, type ModuleId } from '@/state/streak';
import { assets, ClayCard, Logo, Screen } from '@/ui/kit';
import { color, font, shadow } from '@/ui/theme';

const ICONS: Record<ModuleId, number> = {
  'quit-porn': assets.iconLock,
  'quit-weed': assets.iconLeaf,
  'adhd-focus': assets.iconTarget,
  'dopamine-reset': assets.iconMolecule,
};

export default function SelectModule() {
  const s = useStreak();

  function pick(id: ModuleId) {
    s.setModule(id);
    s.completeOnboarding();
    router.replace('/home');
  }

  return (
    <Screen style={styles.root} filaments={false}>
      <View style={styles.head}>
        <Logo size={50} />
        <Text style={styles.title}>Select a module</Text>
        <Text style={styles.sub}>Rewire your brain</Text>
      </View>

      <View style={styles.grid}>
        {(Object.keys(MODULES) as ModuleId[]).map((id) => (
          <ClayCard
            key={id}
            onPress={() => pick(id)}
            selected={s.onboarded && s.module === id}
            style={styles.card}
          >
            <Image source={ICONS[id]} style={styles.icon} contentFit="contain" />
            <Text style={styles.label}>{MODULES[id]}</Text>
          </ClayCard>
        ))}
      </View>

      <View style={[styles.handle, { boxShadow: shadow.raisedSoft }]}>
        <View style={styles.handleBar} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', paddingVertical: 16 },
  head: { alignItems: 'center', marginTop: 12 },
  title: { fontFamily: font.bold, fontSize: 32, color: color.ink, marginTop: 22, letterSpacing: -0.5 },
  sub: { fontFamily: font.regular, fontSize: 18, color: color.inkMuted, marginTop: 6 },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    rowGap: 22,
    alignSelf: 'stretch',
    paddingHorizontal: 4,
  },
  card: {
    width: '47%',
    aspectRatio: 0.98,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },
  icon: { width: '62%', height: '58%' },
  label: { fontFamily: font.medium, fontSize: 19, color: color.ink, textAlign: 'center' },
  handle: {
    width: 170,
    height: 34,
    borderRadius: 999,
    backgroundColor: color.surface,
    borderWidth: 1.5,
    borderColor: color.rim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  handleBar: { width: 60, height: 4, borderRadius: 2, backgroundColor: '#D4D8E0' },
});
