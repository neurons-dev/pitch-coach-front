import { StyleSheet, Text, View } from 'react-native';

import { AnalysisColors } from '@/constants/analysis-theme';

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clampedProgress}%` }]} />
    </View>
  );
}

type ProgressHeaderProps = {
  label: string;
  progress: number;
};

export function ProgressHeader({ label, progress }: ProgressHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.percent}>{Math.round(progress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: AnalysisColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  percent: {
    color: AnalysisColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: AnalysisColors.progressTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: AnalysisColors.primary,
  },
});
