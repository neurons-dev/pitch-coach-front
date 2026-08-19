import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAnalysisResult } from '@/api/analysis-api';
import { MetricCard } from '@/components/analysis/metric-card';
import { MascotIllustration } from '@/components/mascot-illustration';
import { AnalysisColors, MascotVariants } from '@/constants/analysis-theme';
import type { AnalysisResult, ImprovementTone, MetricKey } from '@/types/analysis';

type MetricStyle = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
};

const METRIC_STYLE: Record<MetricKey, MetricStyle> = {
  speed: {
    icon: 'bolt',
    iconColor: '#F4B740',
    accentColor: AnalysisColors.metricBlue,
    backgroundColor: AnalysisColors.tintBlueBg,
    borderColor: AnalysisColors.tintBlueBorder,
  },
  delivery: {
    icon: 'track-changes',
    iconColor: AnalysisColors.metricRed,
    accentColor: AnalysisColors.metricRed,
    backgroundColor: AnalysisColors.tintYellowBg,
    borderColor: AnalysisColors.tintYellowBorder,
  },
  structure: {
    icon: 'assignment',
    iconColor: AnalysisColors.metricGreen,
    accentColor: AnalysisColors.metricGreen,
    backgroundColor: AnalysisColors.tintGreenBg,
    borderColor: AnalysisColors.tintGreenBorder,
  },
  fluency: {
    icon: 'mic',
    iconColor: AnalysisColors.metricPurple,
    accentColor: AnalysisColors.metricPurple,
    backgroundColor: AnalysisColors.tintYellowBg,
    borderColor: AnalysisColors.tintYellowBorder,
  },
  pronunciation: {
    icon: 'record-voice-over',
    iconColor: AnalysisColors.metricOrange,
    accentColor: AnalysisColors.metricOrange,
    backgroundColor: AnalysisColors.tintYellowBg,
    borderColor: AnalysisColors.tintYellowBorder,
  },
  fillerWords: {
    icon: 'chat-bubble-outline',
    iconColor: '#F4B740',
    accentColor: AnalysisColors.metricGreen,
    backgroundColor: AnalysisColors.tintYellowBg,
    borderColor: AnalysisColors.tintYellowBorder,
  },
};

type ImprovementStyle = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  backgroundColor: string;
  borderColor: string;
};

const IMPROVEMENT_STYLE: Record<ImprovementTone, ImprovementStyle> = {
  info: {
    icon: 'speed',
    iconColor: AnalysisColors.metricBlue,
    backgroundColor: AnalysisColors.tintBlueBg,
    borderColor: AnalysisColors.tintBlueBorder,
  },
  warning: {
    icon: 'flare',
    iconColor: AnalysisColors.metricRed,
    backgroundColor: AnalysisColors.tintRedBg,
    borderColor: AnalysisColors.tintRedBorder,
  },
  success: {
    icon: 'fact-check',
    iconColor: AnalysisColors.metricGreen,
    backgroundColor: AnalysisColors.tintGreenBg,
    borderColor: AnalysisColors.tintGreenBorder,
  },
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
      router.replace('/(tabs)' as never);
    }
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
      </View>

      {result === null ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={AnalysisColors.primary} />
          <Text style={styles.loadingText}>결과를 불러오는 중이에요...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.scoreCard}>
            <View style={styles.scoreRing}>
              <Text style={styles.scoreValue}>{result.totalScore}</Text>
              <Text style={styles.scoreUnit}>점</Text>
            </View>
            <MascotIllustration variantIndex={MascotVariants.result} size="sm" />
          </View>

          <View style={styles.metricGrid}>
            {result.metrics.map((metric) => {
              const style = METRIC_STYLE[metric.key];
              return (
                <MetricCard
                  key={metric.key}
                  icon={style.icon}
                  iconColor={style.iconColor}
                  label={metric.label}
                  value={`${metric.score}${metric.unit ?? ''}`}
                  accentColor={style.accentColor}
                  backgroundColor={style.backgroundColor}
                  borderColor={style.borderColor}
                  progress={metric.progress ?? metric.score}
                />
              );
            })}
          </View>

          <View style={styles.coachCard}>
            <View style={styles.coachHeader}>
              <MaterialIcons name="forum" size={20} color={AnalysisColors.button} />
              <Text style={styles.coachTitle}>Coach Mic의 한마디</Text>
            </View>
            <Text style={styles.coachComment}>{result.coachComment}</Text>
          </View>

          <Text style={styles.sectionTitle}>개선 포인트</Text>
          <View style={styles.improvementList}>
            {result.improvements.map((point) => {
              const style = IMPROVEMENT_STYLE[point.tone];
              return (
                <View
                  key={point.title}
                  style={[
                    styles.improvementCard,
                    { backgroundColor: style.backgroundColor, borderColor: style.borderColor },
                  ]}>
                  <View style={styles.improvementIcon}>
                    <MaterialIcons name={style.icon} size={20} color={style.iconColor} />
                  </View>
                  <View style={styles.improvementBody}>
                    <Text style={styles.improvementTitle}>{point.title}</Text>
                    <Text style={styles.improvementDescription}>{point.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={goBack}
            style={({ pressed }) => [styles.returnButton, pressed && styles.pressed]}>
            <Text style={styles.returnButtonText}>돌아가기</Text>
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
    gap: 12,
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
    fontWeight: '800',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 24,
    borderRadius: 20,
    backgroundColor: AnalysisColors.background,
    borderWidth: 1,
    borderColor: AnalysisColors.cardBorder,
    marginBottom: 16,
  },
  scoreRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 8,
    borderColor: AnalysisColors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    color: AnalysisColors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  scoreUnit: {
    color: AnalysisColors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  coachCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: AnalysisColors.background,
    borderWidth: 1,
    borderColor: AnalysisColors.cardBorder,
    marginBottom: 24,
  },
  coachHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  coachTitle: {
    color: AnalysisColors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  coachComment: {
    color: AnalysisColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  sectionTitle: {
    color: AnalysisColors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  improvementList: {
    gap: 12,
    marginBottom: 28,
  },
  improvementCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  improvementIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AnalysisColors.background,
  },
  improvementBody: {
    flex: 1,
  },
  improvementTitle: {
    color: AnalysisColors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  improvementDescription: {
    color: AnalysisColors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  returnButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: AnalysisColors.button,
  },
  returnButtonText: {
    color: AnalysisColors.buttonText,
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
  },
});
