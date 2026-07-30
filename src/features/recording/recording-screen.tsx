import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { uploadRecording } from '@/api/analysis-api';
import { MascotIllustration } from '@/components/mascot-illustration';
import { ControlBar } from '@/components/recording/control-bar';
import { WaveformVisualizer } from '@/components/recording/waveform-visualizer';
import { TipBanner } from '@/components/tip-banner';
import { RecordingColors } from '@/constants/recording-theme';

const RECORDING_TITLE = '자기소개 발표 연습';

function formatTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, '0'))
    .join(':');
}

type RecordingStatus = 'idle' | 'recording' | 'paused';

export default function RecordingScreen() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status !== 'recording') {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const handleStart = () => {
    // TODO(API): 실제 마이크 녹음 시작 (expo-audio 등) 연결 지점
    setElapsedSeconds(0);
    setStatus('recording');
  };

  const handleRestart = () => {
    setElapsedSeconds(0);
    setStatus('recording');
  };

  const goHome = () => {
    router.push('/' as never);
  };

  const handleStop = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus('paused');

    try {
      // TODO(API): 실제 녹음 오디오 파일(audioUri)을 함께 업로드하도록 교체
      const { analysisId } = await uploadRecording({
        title: RECORDING_TITLE,
        durationSeconds: elapsedSeconds,
      });

      router.push({ pathname: '/analysis', params: { analysisId } } as never);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentCard}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
            onPress={goHome}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <MaterialIcons name="arrow-back" size={22} color={RecordingColors.textPrimary} />
          </Pressable>

          {status !== 'idle' && (
            <View style={styles.recBadge}>
              <View style={styles.recDot} />
              <Text style={styles.recText}>{status === 'paused' ? 'PAUSE' : 'REC'}</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{RECORDING_TITLE}</Text>
        <Text style={styles.timer}>{formatTimer(elapsedSeconds)}</Text>

        <WaveformVisualizer active={status === 'recording'} />

        <View style={styles.mascotContainer}>
          <MascotIllustration />
        </View>

        <TipBanner />

        <View style={styles.controls}>
          {status === 'idle' ? (
            <View style={styles.startArea}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="녹음 시작"
                onPress={handleStart}
                style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
                <MaterialIcons name="mic" size={30} color={RecordingColors.stopIcon} />
                <Text style={styles.startLabel}>시작하기</Text>
              </Pressable>
            </View>
          ) : (
            <ControlBar
              isPaused={status === 'paused'}
              onTogglePause={() =>
                setStatus((current) => (current === 'paused' ? 'recording' : 'paused'))
              }
              onStop={handleStop}
              onRestart={handleRestart}
            />
          )}
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
    minHeight: 160,
  },
  controls: {
    marginTop: 'auto',
  },
  startArea: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 36,
  },
  startButton: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RecordingColors.waveform,
    gap: 4,
  },
  startLabel: {
    color: RecordingColors.stopIcon,
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
