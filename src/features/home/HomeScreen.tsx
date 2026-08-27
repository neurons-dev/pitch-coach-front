import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요, 발표자님!</Text>
            <Text style={styles.title}>오늘도 멋진 발표{'\n'}준비해요</Text>
          </View>

          <View style={styles.headerActions}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 7일</Text>
            </View>
            <Pressable style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>⌾</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.analysisCard}>
          <View style={styles.characterWrap}>
            <Text style={styles.sparkleLeft}>✦</Text>
            <Image
              source={require('../../../assets/images/login-character.png')}
              style={styles.character}
              contentFit="contain"
            />
            <Text style={styles.sparkleRight}>✦</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>발표 분석하기</Text>
            <Text style={styles.cardDescription}>발표를 녹음하고 피드백해드릴게요</Text>

            <Pressable style={styles.actionButton} onPress={handleStartRecording}>
              <Text style={styles.actionText}>마이크 녹음 시작</Text>
            </Pressable>

            <Pressable style={styles.actionButton} onPress={handleFileUpload}>
              <Text style={styles.actionText}>파일 업로드</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.recentCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 분석 결과</Text>
            <Pressable onPress={() => router.push('/(tabs)/history' as never)}>
              <Text style={styles.moreText}>전체 보기 &gt;</Text>
            </Pressable>
          </View>

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
    backgroundColor: '#F5F8FF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 26,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greeting: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#5F6B7A',
  },
  title: {
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 31,
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    height: 33,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#F8B833',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  streakText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F59E0B',
  },
  notificationButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3EAF5',
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
  },
  notificationIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  analysisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#3474F6',
  },
  characterWrap: {
    width: 116,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: {
    width: 112,
    height: 112,
  },
  sparkleLeft: {
    position: 'absolute',
    top: 22,
    left: 0,
    fontSize: 15,
    color: '#FFFFFF',
  },
  sparkleRight: {
    position: 'absolute',
    top: 16,
    right: 4,
    fontSize: 17,
    color: '#FFFFFF',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: 6,
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cardDescription: {
    marginBottom: 13,
    fontSize: 12,
    fontWeight: '700',
    color: '#DDE9FF',
  },
  actionButton: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: '#D8E2F2',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  recentCard: {
    marginTop: 30,
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
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6B7280',
  },
  moreText: {
    fontSize: 11,
    fontWeight: '800',
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
