import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { AnalysisColors } from '@/constants/analysis-theme';

type MetricCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  score: number;
  accentColor: string;
};

export function MetricCard({ icon, label, score, accentColor }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialIcons name={icon} size={18} color={accentColor} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.score}>{score}</Text>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: AnalysisColors.background,
    borderWidth: 1,
    borderColor: AnalysisColors.cardBorder,
    overflow: 'hidden',
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
  score: {
    marginTop: 12,
    color: AnalysisColors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  accent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
  },
});
