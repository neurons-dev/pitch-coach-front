import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requestAnalysis, uploadFileToSession } from '@/api/session-api';
import { MascotIllustration } from '@/components/mascot-illustration';
import { ControlBar } from '@/components/recording/control-bar';
import { WaveformVisualizer } from '@/components/recording/waveform-visualizer';
import { TipBanner } from '@/components/tip-banner';
import { RecordingColors } from '@/constants/recording-theme';

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
  const { sessionId, title } = useLocalSearchParams<{ sessionId?: string; title?: string }>();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isRequestingAnalysis, setIsRequestingAnalysis] = useState(false);

  // 세션이 바뀔 때마다(새 세션으로 진입할 때) 녹음 상태를 초기화한다.
  useEffect(() => {
    setElapsedSeconds(0);
    setStatus('idle');
    setIsUploading(false);
    setIsUploaded(false);
    setIsRequestingAnalysis(false);
  }, [sessionId]);

  // 탭 화면은 이동 후에도 언마운트되지 않아서, 화면을 벗어나면 대기 상태로 초기화한다.
  useFocusEffect(
    useCallback(() => {
      return () => {
        setStatus('idle');
        setElapsedSeconds(0);
        setIsUploading(false);
        setIsUploaded(false);
        setIsRequestingAnalysis(false);
      };
    }, []),
  );

  useEffect(() => {
    if (status !== 'recording') {
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // 세션 없이 녹음 탭에 바로 진입하면 세션 생성 화면으로 보낸다.
  if (!sessionId) {
    return <Redirect href={{ pathname: '/session-new', params: { mode: 'record' } } as never} />;
  }

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
    router.replace('/(tabs)' as never);
  };

  // 녹음 종료 버튼: 2단계(파일 업로드)만 진행한다. 분석 요청은 별도 버튼으로 진행한다.
  const handleStop = async () => {
    if (isUploading || isUploaded) {
      return;
    }

    setStatus('paused');
    setIsUploading(true);
    try {
      // TODO(API): 실제 녹음 오디오 파일(audioUri)을 함께 업로드하도록 교체
      await uploadFileToSession(sessionId, {
        uri: '',
        name: title ?? '',
      });
      setIsUploaded(true);
    } catch {
      Alert.alert('업로드 실패', '녹음 파일을 업로드하는 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  // 3단계: 분석 요청 버튼을 눌러야만 분석 화면으로 이동한다.
  const handleRequestAnalysis = async () => {
    if (!isUploaded || isRequestingAnalysis) {
      return;
    }

    setIsRequestingAnalysis(true);
    try {
      const { analysisId } = await requestAnalysis(sessionId);
      router.push({ pathname: '/analysis', params: { analysisId } } as never);
    } catch {
      Alert.alert('분석 요청 실패', '분석을 요청하는 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsRequestingAnalysis(false);
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

        <Text style={styles.title}>{title}</Text>
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
          ) : isUploaded ? (
            <View style={styles.startArea}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="분석 요청"
                onPress={handleRequestAnalysis}
                disabled={isRequestingAnalysis}
                style={({ pressed }) => [
                  styles.startButton,
                  isRequestingAnalysis && styles.startButtonDisabled,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.startLabel}>
                  {isRequestingAnalysis ? '분석 요청 중...' : '분석 요청'}
                </Text>
              </Pressable>
            </View>
          ) : isUploading ? (
            <View style={styles.startArea}>
              <Text style={styles.submittingText}>파일 업로드 중...</Text>
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
  startButtonDisabled: {
    opacity: 0.6,
  },
  startLabel: {
    color: RecordingColors.stopIcon,
    fontSize: 13,
    fontWeight: '700',
  },
  submittingText: {
    color: RecordingColors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
