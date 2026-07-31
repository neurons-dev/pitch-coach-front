import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnalysisColors } from '@/constants/analysis-theme';
import { getRandomTip } from '@/constants/tips';

export function TipBanner() {
  // 화면에 들어올 때마다 랜덤으로 팁 하나를 고른다.
  const [tip] = useState(getRandomTip);

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>TIP</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{tip.title}</Text>
        <Text style={styles.subtitle}>{tip.description}</Text>
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
    backgroundColor: AnalysisColors.primaryLight,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AnalysisColors.primary,
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
    color: AnalysisColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: AnalysisColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
