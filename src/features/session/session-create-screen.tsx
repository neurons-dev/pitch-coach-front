import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createSession } from '@/api/session-api';

const RECORDING_TITLE = '자기소개 발표 연습';

type SessionMode = 'record' | 'upload';

const modeCopy: Record<SessionMode, { heading: string; hint: string }> = {
  record: {
    heading: '녹음할 발표 세션을 만들어요',
    hint: '제목을 입력하고 세션을 생성하면 바로 녹음을 시작할 수 있어요.',
  },
  upload: {
    heading: '업로드할 분석 세션을 만들어요',
    hint: '제목을 입력하고 세션을 생성하면 파일을 업로드할 수 있어요.',
  },
};

export default function SessionCreateScreen() {
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const mode: SessionMode = modeParam === 'upload' ? 'upload' : 'record';

  const [title, setTitle] = useState(mode === 'record' ? RECORDING_TITLE : '');
  const [creatingSession, setCreatingSession] = useState(false);

  const goHome = () => {
    router.push('/' as never);
  };

  const handleCreateSession = async () => {
    if (creatingSession) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('제목을 입력해주세요.');
      return;
    }

    setCreatingSession(true);
    try {
      const { sessionId } = await createSession(trimmedTitle);

      if (mode === 'record') {
        router.replace({
          pathname: '/recording',
          params: { sessionId, title: trimmedTitle },
        } as never);
      } else {
        router.replace({
          pathname: '/upload',
          params: { sessionId, title: trimmedTitle },
        } as never);
      }
    } catch {
      Alert.alert('세션 생성 실패', '세션을 만드는 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setCreatingSession(false);
    }
  };

  const copy = modeCopy[mode];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          onPress={goHome}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <MaterialIcons name="arrow-back" size={22} color="#1F2937" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.stepLabel}>1단계 · 세션 생성</Text>
        <Text style={styles.heading}>{copy.heading}</Text>
        <Text style={styles.hint}>{copy.hint}</Text>

        <Text style={styles.inputLabel}>제목</Text>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="발표 제목을 입력하세요"
          placeholderTextColor="#A1AAB8"
          editable={!creatingSession}
        />

        <Pressable
          accessibilityRole="button"
          onPress={handleCreateSession}
          disabled={creatingSession}
          style={({ pressed }) => [
            styles.createButton,
            creatingSession && styles.createButtonDisabled,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.createButtonText}>
            {creatingSession ? '세션 생성 중...' : '세션 생성'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3EAF5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3474F6',
    marginBottom: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 10,
  },
  hint: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 8,
  },
  titleInput: {
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E8F5',
    borderRadius: 12,
  },
  createButton: {
    marginTop: 24,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#3474F6',
  },
  createButtonDisabled: {
    backgroundColor: '#A9C2F5',
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
});
