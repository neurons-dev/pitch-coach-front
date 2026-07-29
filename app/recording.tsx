import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ControlBar } from '@/components/recording/control-bar';
import { MascotIllustration } from '@/components/recording/mascot-illustration';
import { TipBanner } from '@/components/recording/tip-banner';
import { WaveformVisualizer } from '@/components/recording/waveform-visualizer';
import { RecordingColors } from '@/constants/recording-theme';

const INITIAL_SECONDS = 3 * 60 + 26;

function formatTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, '0'))
    .join(':');
}

export default function RecordingScreen() {
  const [elapsedSeconds, setElapsedSeconds] = useState(INITIAL_SECONDS);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleRestart = () => {
    setElapsedSeconds(0);
    setIsPaused(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentCard}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <MaterialIcons name="arrow-back" size={22} color={RecordingColors.textPrimary} />
          </Pressable>

          <View style={styles.recBadge}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
          </View>
        </View>

        <Text style={styles.title}>자기소개 발표 연습</Text>
        <Text style={styles.timer}>{formatTimer(elapsedSeconds)}</Text>

        <WaveformVisualizer active={!isPaused} />

        <View style={styles.mascotContainer}>
          <MascotIllustration />
        </View>

        <TipBanner />

        <View style={styles.controls}>
          <ControlBar
            onPlay={() => setIsPaused((current) => !current)}
            onStop={() => router.back()}
            onRestart={handleRestart}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RecordingColors.screen,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contentCard: {
    flex: 1,
    backgroundColor: RecordingColors.background,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: RecordingColors.cardBorder,
    paddingHorizontal: 20,
    paddingTop: 16,
    shadowColor: RecordingColors.cardGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RecordingColors.controlSecondary,
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: RecordingColors.rec,
  },
  recText: {
    color: RecordingColors.rec,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    marginTop: 32,
    textAlign: 'center',
    color: RecordingColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  timer: {
    marginTop: 18,
    textAlign: 'center',
    color: RecordingColors.textPrimary,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  mascotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  controls: {
    marginTop: 'auto',
  },
  pressed: {
    opacity: 0.85,
  },
});
