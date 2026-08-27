import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { AnalysisColors } from '@/constants/analysis-theme';

type MetricCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  label: string;
  /** 카드에 표시할 값 (예: '82', '2개') */
  value: string;
  /** 값 텍스트와 진행 바 색상 */
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  /** 진행 바 채움 비율 (0~100) */
  progress: number;
};

export function MetricCard({
  icon,
  iconColor,
  label,
  value,
  accentColor,
  backgroundColor,
  borderColor,
  progress,
}: MetricCardProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={[styles.card, { backgroundColor, borderColor }]}>
      <View style={styles.header}>
        <MaterialIcons name={icon} size={16} color={iconColor} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: accentColor, width: `${clampedProgress}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: AnalysisColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
  },
  progressTrack: {
    marginTop: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
