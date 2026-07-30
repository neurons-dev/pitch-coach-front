import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AnalysisColors } from '@/constants/analysis-theme';

export type AnalysisStepStatus = 'done' | 'active' | 'pending';

type AnalysisStepCardProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  status: AnalysisStepStatus;
};

export function AnalysisStepCard({ icon, label, status }: AnalysisStepCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <MaterialIcons name={icon} size={18} color={AnalysisColors.primary} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>

      {status === 'done' ? (
        <View style={styles.doneBadge}>
          <MaterialIcons name="check" size={16} color="#FFFFFF" />
        </View>
      ) : (
        <ActivityIndicator
          size="small"
          color={status === 'active' ? AnalysisColors.primary : '#B8C4D6'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: AnalysisColors.primaryLight,
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AnalysisColors.background,
  },
  label: {
    color: AnalysisColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  doneBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AnalysisColors.success,
  },
});
