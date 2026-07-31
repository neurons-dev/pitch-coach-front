import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAnalysisProgress } from '@/api/analysis-api';
import { AnalysisStepCard } from '@/components/analysis/analysis-step-card';
import { ProgressBar, ProgressHeader } from '@/components/analysis/progress-bar';
import { MascotIllustration } from '@/components/mascot-illustration';
import { TipBanner } from '@/components/tip-banner';
import { AnalysisColors, MascotVariants } from '@/constants/analysis-theme';

const STEPS = [
  { icon: 'mic' as const, label: '음성 인식(STT)' },
  { icon: 'record-voice-over' as const, label: '발음 정확도' },
  { icon: 'speed' as const, label: '말의 속도 분석' },
  { icon: 'account-tree' as const, label: '발표 구조 분석' },
  { icon: 'edit-note' as const, label: 'AI 피드백 생성' },
];

const PROGRESS_LABELS = [
  '음성 데이터 처리 중...',
  '발음 정확도 확인 중...',
  '말의 속도 분석 중...',
  '발표 구조 확인 중...',
  'AI 피드백 생성 중...',
];

const POLL_INTERVAL_MS = 400;

function getStepStatus(stepIndex: number, activeStep: number) {
  if (stepIndex < activeStep) {
    return 'done' as const;
  }

  if (stepIndex === activeStep) {
    return 'active' as const;
  }

  return 'pending' as const;
}

export default function AnalysisScreen() {
  const { analysisId } = useLocalSearchParams<{ analysisId?: string }>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // TODO(API): 백엔드가 웹소켓/SSE를 제공하면 폴링 대신 그걸 사용해도 된다.
    const interval = setInterval(async () => {
      const { progress: next } = await getAnalysisProgress(analysisId ?? 'mock-analysis-id');

      if (cancelled) {
        return;
      }

      setProgress(next);

      if (next >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (!cancelled) {
            router.replace({ pathname: '/result', params: { analysisId } } as never);
          }
        }, 600);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [analysisId]);

  const activeStep = useMemo(() => {
    if (progress >= 100) {
      return STEPS.length;
    }

    const stepSize = 100 / STEPS.length;
    return Math.min(Math.floor(progress / stepSize), STEPS.length - 1);
  }, [progress]);

  const progressLabel = PROGRESS_LABELS[Math.min(activeStep, PROGRESS_LABELS.length - 1)];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.mascotWrap}>
          <MascotIllustration variantIndex={MascotVariants.analyzing} />
        </View>

        <Text style={styles.title}>AI가 분석 중이에요</Text>
        <Text style={styles.subtitle}>잠시만 기다려주세요 ...</Text>

        <View style={styles.progressSection}>
          <ProgressHeader label={progressLabel} progress={progress} />
          <ProgressBar progress={progress} />
        </View>

        <View>
          {STEPS.map((step, index) => (
            <AnalysisStepCard
              key={step.label}
              icon={step.icon}
              label={step.label}
              status={getStepStatus(index, activeStep)}
            />
          ))}
        </View>

        <TipBanner />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AnalysisColors.screen,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  mascotWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    color: AnalysisColors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: AnalysisColors.textSecondary,
    fontSize: 15,
  },
  progressSection: {
    marginTop: 28,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: AnalysisColors.background,
    borderWidth: 1,
    borderColor: AnalysisColors.cardBorder,
  },
});
