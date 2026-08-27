import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder } from 'expo-audio';
import { Redirect, router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requestAnalysis, uploadFileToSession } from '@/api/session-api';
import { MascotIllustration } from '@/components/mascot-illustration';
import { ControlBar } from '@/components/recording/control-bar';
import { WaveformVisualizer } from '@/components/recording/waveform-visualizer';
import { TipBanner } from '@/components/tip-banner';
import { RecordingColors } from '@/constants/recording-theme';

// 작은 화면(iPhone SE 등)에서는 팁 배너를 숨겨 하단 컨트롤이 잘리지 않게 한다.
const COMPACT_HEIGHT_THRESHOLD = 700;

// 캐릭터 크기는 화면 높이에 비례해서 조절한다. 기준 높이는 iPhone 13 Pro(844).
const MASCOT_REFERENCE_HEIGHT = 844;
const MASCOT_MIN_SCALE = 0.72;

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
  const navigation = useNavigation();
  const { height: windowHeight } = useWindowDimensions();
  const isCompact = windowHeight < COMPACT_HEIGHT_THRESHOLD;
  const mascotScale = Math.min(1, Math.max(MASCOT_MIN_SCALE, windowHeight / MASCOT_REFERENCE_HEIGHT));
  const { sessionId, title } = useLocalSearchParams<{ sessionId?: string; title?: string }>();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

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
  // 라우트 파라미터(sessionId)도 함께 비워서, 다음 진입 시 세션 생성 화면부터 시작하게 한다.
  useFocusEffect(
    useCallback(() => {
      return () => {
        // 언마운트 시점에는 recorder 네이티브 객체가 이미 해제되어
        // isRecording 접근만으로도 예외가 날 수 있어 try/catch로 감싼다.
        try {
          if (recorder.isRecording) {
            recorder.stop().catch(() => {});
          }
        } catch {
          // 이미 해제된 경우 정리할 녹음이 없으므로 무시한다.
        }
        setStatus('idle');
        setElapsedSeconds(0);
        setIsUploading(false);
        setIsUploaded(false);
        setIsRequestingAnalysis(false);
        navigation.setParams({ sessionId: undefined, title: undefined } as never);
      };
    }, [navigation, recorder]),
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

  const startRecording = async () => {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('마이크 권한 필요', '발표 녹음을 위해 설정에서 마이크 권한을 허용해주세요.');
      return false;
    }

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  };

  const handleStart = async () => {
    try {
      if (!(await startRecording())) {
        return;
      }
      setElapsedSeconds(0);
      setStatus('recording');
    } catch {
      Alert.alert('녹음 시작 실패', '녹음을 시작하는 중 문제가 발생했어요. 다시 시도해주세요.');
    }
  };

  const handleRestart = async () => {
    try {
      if (recorder.isRecording) {
        await recorder.stop();
      }
      if (!(await startRecording())) {
        return;
      }
      setElapsedSeconds(0);
      setStatus('recording');
    } catch {
      Alert.alert('녹음 재시작 실패', '녹음을 다시 시작하는 중 문제가 발생했어요.');
    }
  };

  const handleTogglePause = () => {
    if (status === 'paused') {
      recorder.record();
      setStatus('recording');
    } else {
      recorder.pause();
      setStatus('paused');
    }
  };

  const goHome = () => {
    router.replace('/(tabs)' as never);
  };

  // 녹음 종료 버튼: 녹음을 마치고 2단계(파일 업로드)만 진행한다. 분석 요청은 별도 버튼으로 진행한다.
  const handleStop = async () => {
    if (isUploading || isUploaded) {
      return;
    }

    setStatus('paused');
    setIsUploading(true);
    try {
      await recorder.stop();
      const audioUri = recorder.uri;
      if (!audioUri) {
        throw new Error('녹음 파일 경로를 찾을 수 없습니다.');
      }

      await uploadFileToSession(sessionId, {
        uri: audioUri,
        name: 'recording.m4a',
        mimeType: 'audio/x-m4a',
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
    } catch (error) {
      console.log('[DEBUG] requestAnalysis error', {
        message: (error as any)?.message,
        status: (error as any)?.status,
      });
      Alert.alert('분석 요청 실패', '분석을 요청하는 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsRequestingAnalysis(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
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
        <Text style={[styles.timer, isCompact && styles.timerCompact]}>
          {formatTimer(elapsedSeconds)}
        </Text>

        <WaveformVisualizer active={status === 'recording'} />

        <View style={[styles.mascotContainer, isCompact && styles.mascotContainerCompact]}>
          <MascotIllustration scale={mascotScale} />
        </View>

        {!isCompact && <TipBanner />}

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
              onTogglePause={handleTogglePause}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RecordingColors.backButton,
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
    marginTop: 40,
    textAlign: 'center',
    color: RecordingColors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  timer: {
    marginTop: 20,
    textAlign: 'center',
    color: RecordingColors.textPrimary,
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  timerCompact: {
    marginTop: 10,
    fontSize: 32,
  },
  mascotContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  mascotContainerCompact: {
    minHeight: 90,
  },
  controls: {
    marginTop: 'auto',
  },
  startArea: {
    alignItems: 'center',
    paddingTop: 24,
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
