import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAnalysisResult } from '@/api/analysis-api';
import { MetricCard } from '@/components/analysis/metric-card';
import { MascotIllustration } from '@/components/mascot-illustration';
import { AnalysisColors, MascotVariants } from '@/constants/analysis-theme';
import type { AnalysisResult, MetricKey } from '@/types/analysis';

const METRIC_STYLE: Record<MetricKey, { icon: keyof typeof MaterialIcons.glyphMap; color: string }> = {
  speed: { icon: 'bolt', color: AnalysisColors.metricBlue },
  delivery: { icon: 'track-changes', color: AnalysisColors.metricRed },
  structure: { icon: 'assignment', color: AnalysisColors.metricGreen },
  fluency: { icon: 'mic', color: AnalysisColors.metricPurple },
};

export default function ResultScreen() {
  const { analysisId } = useLocalSearchParams<{ analysisId?: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAnalysisResult(analysisId ?? 'mock-analysis-id').then((data) => {
      if (!cancelled) {
        setResult(data);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [analysisId]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/' as never);
    }
  };

  const openFeedbackDetail = () => {
    // TODO(API): AI 피드백 상세 화면/API 연결 후 이동하도록 교체
    Alert.alert('준비 중', 'AI 피드백 상세 기능은 백엔드 API 연결 후 제공돼요.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          onPress={goBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <MaterialIcons name="arrow-back" size={22} color={AnalysisColors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>분석 결과</Text>
        <View style={styles.headerSpacer} />
      </View>

      {result === null ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={AnalysisColors.primary} />
          <Text style={styles.loadingText}>결과를 불러오는 중이에요...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.scoreCard}>
            <View style={styles.scoreRow}>
              <View style={styles.scoreRing}>
                <Text style={styles.scoreValue}>{result.totalScore}</Text>
                <Text style={styles.scoreUnit}>점</Text>
              </View>
              <MascotIllustration variantIndex={MascotVariants.result} size="sm" />
            </View>

            <Text style={styles.scoreCaption}>
              전체 평균보다{' '}
              <Text style={styles.scoreHighlight}>
                {Math.abs(result.comparedToAveragePercent)}% {result.comparedToAveragePercent >= 0 ? '높아요' : '낮아요'}
              </Text>{' '}
              🎉
            </Text>
          </View>

          <View style={styles.metricGrid}>
            {result.metrics.map((metric) => (
              <MetricCard
                key={metric.key}
                icon={METRIC_STYLE[metric.key].icon}
                label={metric.label}
                score={metric.score}
                accentColor={METRIC_STYLE[metric.key].color}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={openFeedbackDetail}
            style={({ pressed }) => [styles.feedbackButton, pressed && styles.pressed]}>
            <MaterialIcons name="bar-chart" size={20} color={AnalysisColors.buttonText} />
            <Text style={styles.feedbackButtonText}>AI 피드백 자세히 보기</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AnalysisColors.screen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AnalysisColors.background,
  },
  headerTitle: {
    color: AnalysisColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: AnalysisColors.textSecondary,
    fontSize: 14,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  scoreCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: AnalysisColors.background,
    borderWidth: 1,
    borderColor: AnalysisColors.cardBorder,
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 6,
    borderColor: AnalysisColors.scoreRing,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  scoreValue: {
    color: AnalysisColors.scoreRing,
    fontSize: 32,
    fontWeight: '800',
  },
  scoreUnit: {
    color: AnalysisColors.scoreRing,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  scoreCaption: {
    marginTop: 16,
    color: AnalysisColors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  scoreHighlight: {
    color: AnalysisColors.highlightGreen,
    fontWeight: '700',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: AnalysisColors.button,
  },
  feedbackButtonText: {
    color: AnalysisColors.buttonText,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
