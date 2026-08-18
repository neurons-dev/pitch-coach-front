import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requestAnalysis, uploadFileToSession } from '@/api/session-api';

export default function UploadScreen() {
  const { sessionId, title } = useLocalSearchParams<{ sessionId?: string; title?: string }>();

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRequestingAnalysis, setIsRequestingAnalysis] = useState(false);

  if (!sessionId) {
    return <Redirect href={{ pathname: '/session-new', params: { mode: 'upload' } } as never} />;
  }

  const goHome = () => {
    router.replace('/(tabs)' as never);
  };

  // 2단계: 세션에 파일 업로드
  const handleSelectFile = async () => {
    if (isUploading || uploadedFileName) return;

    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    setIsUploading(true);
    try {
      await uploadFileToSession(sessionId, {
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType,
      });
      setUploadedFileName(file.name);
    } catch {
      Alert.alert('업로드 실패', '파일을 업로드하는 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  // 3단계: 분석 요청 버튼을 눌러야만 분석 화면으로 이동한다.
  const handleRequestAnalysis = async () => {
    if (!uploadedFileName || isRequestingAnalysis) return;

    setIsRequestingAnalysis(true);
    try {
      const { analysisId } = await requestAnalysis(sessionId);
      router.push({ pathname: '/analysis', params: { analysisId } } as never);
    } catch {
      Alert.alert('분석 요청 실패', '분석을 요청하는 중 문제가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsRequestingAnalysis(false);
    }
  };

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
        <Text style={styles.stepLabel}>2단계 · 파일 업로드</Text>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.hint}>분석할 오디오 파일을 선택해서 업로드해주세요.</Text>

        <Pressable
          accessibilityRole="button"
          onPress={handleSelectFile}
          disabled={isUploading || !!uploadedFileName}
          style={({ pressed }) => [
            styles.actionButton,
            (isUploading || !!uploadedFileName) && styles.actionButtonDisabled,
            pressed && styles.pressed,
          ]}>
          <Text style={styles.actionButtonText}>
            {uploadedFileName
              ? `✓ 업로드 완료 (${uploadedFileName})`
              : isUploading
                ? '업로드 중...'
                : '파일 선택 및 업로드'}
          </Text>
        </Pressable>

        {uploadedFileName && (
          <>
            <Text style={styles.stepLabel}>3단계 · 분석 요청</Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleRequestAnalysis}
              disabled={isRequestingAnalysis}
              style={({ pressed }) => [
                styles.actionButton,
                isRequestingAnalysis && styles.actionButtonDisabled,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.actionButtonText}>
                {isRequestingAnalysis ? '분석 요청 중...' : '분석 요청'}
              </Text>
            </Pressable>
          </>
        )}
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
    marginTop: 24,
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
    marginBottom: 8,
  },
  actionButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#3474F6',
  },
  actionButtonDisabled: {
    backgroundColor: '#A9C2F5',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
});
