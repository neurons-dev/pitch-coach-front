import { StyleSheet, Text, View } from 'react-native';

import { RecordingColors } from '@/constants/recording-theme';

export function TipBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>TIP</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>적정 길이 5~8분</Text>
        <Text style={styles.subtitle}>3~5분 분량이 적절해요</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    marginHorizontal: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: RecordingColors.tipBackground,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RecordingColors.tipBadge,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: RecordingColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: RecordingColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
