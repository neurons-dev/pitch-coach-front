import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getGrowthHistory } from '@/api/history-api';
import { RecordingColors } from '@/constants/recording-theme';
import type { HistoryItem } from '@/types/history';

function scoreColor(score: number) {
  if (score >= 90) return '#4CAF50';
  if (score >= 80) return '#3D6DF5';
  if (score >= 60) return '#F0B429';
  return '#E53935';
}

function formatDate(isoDate: string) {
  return isoDate.replaceAll('-', '.');
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}초`;
  return `${minutes}분 ${seconds}초`;
}

export default function HistoryScreen() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setHasError(false);

      getGrowthHistory()
        .then((data) => {
          if (!cancelled) {
            setItems(data);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setHasError(true);
          }
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const openResult = (item: HistoryItem) => {
    router.push({
      pathname: '/result',
      params: { analysisId: item.analysisId, origin: 'history' },
    } as never);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>히스토리</Text>
      </View>
      {hasError ? (
        <View style={styles.loading}>
          <Text style={styles.emptyText}>목록을 불러오지 못했어요.</Text>
          <Text style={styles.emptyHint}>잠시 후 다시 시도해주세요.</Text>
        </View>
      ) : items === null ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#3D6DF5" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.loading}>
          <View style={styles.emptyIconBadge}>
            <MaterialIcons name="show-chart" size={28} color="#8CA0C7" />
          </View>
          <Text style={styles.emptyText}>아직 연습 기록이 없어요.</Text>
          <Text style={styles.emptyHint}>첫 발표 연습을 시작해보세요!</Text>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.push({ pathname: '/session-new', params: { mode: 'record' } } as never)
            }
            style={({ pressed }) => [styles.emptyButton, pressed && styles.pressed]}>
            <MaterialIcons name="mic" size={16} color="#FFFFFF" />
            <Text style={styles.emptyButtonText}>첫 발표 연습하러 가기</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.analysisId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const color = scoreColor(item.totalScore);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.title} 분석 결과 보기`}
                onPress={() => openResult(item)}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowMeta}>
                    {formatDate(item.practicedAt)} · {formatDuration(item.durationSeconds)}
                  </Text>
                </View>

                <View style={[styles.scoreBadge, { borderColor: color }]}>
                  <Text style={[styles.scoreText, { color }]}>{item.totalScore}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#B9C2CF" />
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RecordingColors.screen,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8F5',
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: RecordingColors.tipBackground,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#374151',
  },
  emptyHint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A94A6',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 22,
    height: 48,
    borderRadius: 24,
    backgroundColor: RecordingColors.primary,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E8F5',
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  rowMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A94A6',
  },
  separator: {
    height: 12,
  },
  scoreBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.7,
  },
});
