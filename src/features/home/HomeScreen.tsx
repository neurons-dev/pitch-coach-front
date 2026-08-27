import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecordingColors } from '@/constants/recording-theme';
import { getRecentAnalyses } from '@/api/history-api';
import type { HistoryItem } from '@/types/history';

function getScoreColor(score: number) {
  if (score >= 90) return '#45C71B';
  if (score >= 80) return '#3474F6';
  if (score >= 60) return '#F8B833';
  return '#EF3340';
}

function formatItemDate(item: HistoryItem) {
  const date = item.practicedAt.replaceAll('-', '.');
  const minutes = Math.floor(item.durationSeconds / 60);
  const seconds = item.durationSeconds % 60;
  const duration = minutes === 0 ? `${seconds}초` : `${minutes}분 ${seconds}초`;
  return `${date} · ${duration}`;
}

export default function HomeScreen() {
  const [recentAnalyses, setRecentAnalyses] = useState<HistoryItem[]>([]);

  // 홈에 들어올 때마다 최근 분석 결과를 새로 고침한다.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      getRecentAnalyses(4)
        .then((items) => {
          if (!cancelled) {
            setRecentAnalyses(items);
          }
        })
        .catch(() => {
          // 조회 실패 시 기존 목록을 유지한다.
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const handleStartRecording = () => {
    router.push({ pathname: '/session-new', params: { mode: 'record' } } as never);
  };

  const handleFileUpload = () => {
    router.push({ pathname: '/session-new', params: { mode: 'upload' } } as never);
  };

    const goToHistory = () => {
    router.push('/(tabs)/history' as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>안녕하세요, 발표자님!</Text>
          <Text style={styles.subtitle}>오늘도 멋진 발표를 준비해요.</Text>
        </View>

        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <View style={styles.characterWrap}>
              <Image
                source={require('../../../assets/images/login-character.png')}
                style={styles.character}
                contentFit="contain"
              />
            </View>

            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle}>새 발표 분석하기</Text>
              <Text style={styles.cardDescription}>
                발표 음성을 녹음하거나{'\n'}파일을 업로드해주세요
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.actionButton} onPress={handleStartRecording}>
              <MaterialIcons name="mic" size={18} color="#1F2937" />
              <Text style={styles.actionText}>녹음 시작</Text>
            </Pressable>

            <Pressable style={styles.actionButton} onPress={handleFileUpload}>
              <MaterialIcons name="upload" size={18} color="#1F2937" />
              <Text style={styles.actionText}>파일 업로드</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.recentCard}>
          <Pressable style={styles.sectionHeader} onPress={goToHistory}>
            <Text style={styles.sectionTitle}>최근 분석 결과</Text>
            <Text style={styles.sectionChevron}>&gt;</Text>
          </Pressable>

          {recentAnalyses.length === 0 && (
            <Text style={styles.emptyText}>아직 분석 기록이 없어요. 첫 발표 연습을 시작해보세요!</Text>
          )}

          {recentAnalyses.map((item) => (
            <Pressable
              key={item.analysisId}
              accessibilityRole="button"
              accessibilityLabel={`${item.title} 분석 결과 보기`}
              onPress={() =>
                router.push({ pathname: '/result', params: { analysisId: item.analysisId } } as never)
              }
              style={styles.analysisItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDate}>{formatItemDate(item)}</Text>
              </View>

              <View style={[styles.scoreCircle, { borderColor: getScoreColor(item.totalScore) }]}>
                <Text style={styles.scoreText}>{item.totalScore}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RecordingColors.screen,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  analysisCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#3474F6',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 18,
  },
  characterWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  character: {
    width: 64,
    height: 64,
    marginLeft: 4,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DDE9FF',
    lineHeight: 19,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 4,
    borderBottomColor: '#D8E2F2',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  recentCard: {
    marginTop: 24,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E8F5',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 17,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#374151',
  },
  sectionChevron: {
    fontSize: 13,
    fontWeight: '900',
    color: '#A1AAB8',
  },
  emptyText: {
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#98A3B3',
  },
  analysisItem: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemTitle: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '900',
    color: '#202938',
  },
  itemDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#98A3B3',
  },
  scoreCircle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
});
