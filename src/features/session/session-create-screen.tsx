import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getPracticeTypes } from '@/api/practice-type-api';
import { createSession } from '@/api/session-api';
import type { PracticeType, PracticeTypeCode } from '@/types/analysis';

const RECORDING_TITLE = '자기소개 발표 연습';

type SessionMode = 'record' | 'upload';

/** API 로딩 전/실패 시에 쓰는 기본 발표 유형 목록. */
const DEFAULT_PRACTICE_TYPES: PracticeType[] = [
  { code: 'INTERVIEW', label: '면접형', recommendedMinSec: 180, recommendedMaxSec: 300 },
  { code: 'PT', label: 'PT발표형', recommendedMinSec: 300, recommendedMaxSec: 480 },
  { code: 'SPEECH', label: '스피치형', recommendedMinSec: 180, recommendedMaxSec: 300 },
];

const modeCopy: Record<SessionMode, { heading: string; hint: string }> = {
  record: {
    heading: '녹음할 발표 세션을 만들어요',
    hint: '제목과 발표 유형, 목표 발표시간을 입력하고 세션을 생성하면 바로 녹음을 시작할 수 있어요.',
  },
  upload: {
    heading: '업로드할 분석 세션을 만들어요',
    hint: '제목과 발표 유형, 목표 발표시간을 입력하고 세션을 생성하면 파일을 업로드할 수 있어요.',
  },
};

export default function SessionCreateScreen() {
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const mode: SessionMode = modeParam === 'upload' ? 'upload' : 'record';

  const [title, setTitle] = useState(mode === 'record' ? RECORDING_TITLE : '');
  const [practiceTypes, setPracticeTypes] = useState<PracticeType[]>(DEFAULT_PRACTICE_TYPES);
  const [practiceTypeCode, setPracticeTypeCode] = useState<PracticeTypeCode | null>(null);
  const [targetMinutesText, setTargetMinutesText] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getPracticeTypes()
      .then((types) => {
        if (!cancelled && types.length > 0) {
          setPracticeTypes(types);
        }
      })
      .catch(() => {
        // 조회 실패 시 기본 목록을 그대로 사용한다.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedType = practiceTypes.find((type) => type.code === practiceTypeCode);

  const goHome = () => {
    router.replace('/(tabs)' as never);
  };

  const handleCreateSession = async () => {
    if (creatingSession) return;

    Keyboard.dismiss();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('제목을 입력해주세요.');
      return;
    }

    if (!practiceTypeCode) {
      Alert.alert('발표 유형을 선택해주세요.');
      return;
    }

    const targetMinutes = Number(targetMinutesText.trim());
    if (!targetMinutesText.trim() || !Number.isFinite(targetMinutes) || targetMinutes <= 0) {
      Alert.alert('목표 발표시간을 분 단위 숫자로 입력해주세요.');
      return;
    }

    setCreatingSession(true);
    try {
      const { sessionId } = await createSession({
        title: trimmedTitle,
        practiceTypeCode,
        targetDurationSeconds: Math.round(targetMinutes * 60),
      });

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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

          <Text style={styles.inputLabel}>발표 유형</Text>
          <View style={styles.typeOptions}>
            {practiceTypes.map((option) => {
              const selected = practiceTypeCode === option.code;
              return (
                <Pressable
                  key={option.code}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setPracticeTypeCode(option.code)}
                  disabled={creatingSession}
                  style={({ pressed }) => [
                    styles.typeChip,
                    selected && styles.typeChipSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.inputLabel}>목표 발표시간 (분)</Text>
          <TextInput
            style={styles.titleInput}
            value={targetMinutesText}
            onChangeText={setTargetMinutesText}
            placeholder="예: 5"
            placeholderTextColor="#A1AAB8"
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            editable={!creatingSession}
          />
          <Text style={styles.fieldHint}>
            {selectedType
              ? `${selectedType.label} 추천 시간은 ${Math.round(selectedType.recommendedMinSec / 60)}~${Math.round(selectedType.recommendedMaxSec / 60)}분이에요. 녹음 길이는 제한되지 않아요.`
              : '녹음 길이는 제한되지 않고, AI 분석 시 기준값으로만 사용돼요.'}
          </Text>

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
      </TouchableWithoutFeedback>
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
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    marginTop: 20,
    marginBottom: 8,
  },
  typeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 14,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E8F5',
  },
  typeChipSelected: {
    backgroundColor: '#3474F6',
    borderColor: '#3474F6',
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  typeChipTextSelected: {
    color: '#FFFFFF',
  },
  fieldHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#8A94A6',
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
