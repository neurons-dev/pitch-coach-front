import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { deleteAccount } from '@/api/user-api';
import { clearTokens } from '@/store/auth-store';

const CONFIRM_ITEMS = [
  '모든 발표 기록 및 AI 분석 데이터가 영구 삭제됩니다.',
  '설정한 목표 및 연습 기록이 복구 불가능한 상태로 삭제됩니다.',
  '탈퇴 후 30일 이내 동일 이메일로 재가입이 불가합니다.',
];

export default function AccountDeletionScreen() {
  const [checked, setChecked] = useState<boolean[]>(CONFIRM_ITEMS.map(() => false));
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allChecked = checked.every(Boolean);
  const canSubmit = allChecked && password.length > 0;

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/mypage' as never);
    }
  };

  const toggleItem = (index: number) => {
    setChecked((current) => current.map((value, i) => (i === index ? !value : value)));
  };

  const handleDeleteAccount = () => {
    Alert.alert('정말 탈퇴하시겠어요?', '이 작업은 되돌릴 수 없습니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '탈퇴',
        style: 'destructive',
        onPress: async () => {
          setIsSubmitting(true);
          try {
            await deleteAccount({ password });
            await clearTokens();
            router.replace('/login');
          } catch (error) {
            const message = error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.';
            Alert.alert('탈퇴 실패', message);
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
            onPress={goBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <MaterialIcons name="arrow-back" size={22} color="#1F2937" />
          </Pressable>
          <Text style={styles.headerTitle}>회원 탈퇴</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.warningIconWrap}>
            <MaterialIcons name="warning" size={30} color="#EF4444" />
          </View>
          <Text style={styles.warningTitle}>탈퇴 전 꼭 확인해 주세요</Text>

          <View style={styles.checkList}>
            {CONFIRM_ITEMS.map((item, index) => (
              <Pressable
                key={item}
                style={styles.checkRow}
                onPress={() => toggleItem(index)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: checked[index] }}>
                <View style={[styles.checkBox, checked[index] && styles.checkBoxChecked]}>
                  {checked[index] && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkLabel}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.passwordSection}>
            <Text style={styles.passwordLabel}>본인 확인을 위해 비밀번호를 입력해주세요</Text>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호 입력"
              placeholderTextColor="#9AA3B2"
              secureTextEntry
            />
          </View>

          <Pressable
            style={[styles.deleteButton, !canSubmit && styles.deleteButtonDisabled]}
            onPress={handleDeleteAccount}
            disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.deleteButtonText}>회원 탈퇴</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F8FF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 42,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  warningIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDEAEA',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 40,
  },
  checkList: {
    width: '100%',
    gap: 16,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkBox: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#D8E2F2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBFCFF',
  },
  checkBoxChecked: {
    backgroundColor: '#3474F6',
    borderColor: '#3474F6',
  },
  checkLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    color: '#4B5563',
  },
  passwordSection: {
    width: '100%',
    marginTop: 24,
  },
  passwordLabel: {
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  passwordInput: {
    height: 52,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderColor: '#DFE7F3',
    borderRadius: 15,
    backgroundColor: '#FBFCFF',
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2430',
  },
  deleteButton: {
    width: '100%',
    height: 56,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#EF4444',
  },
  deleteButtonDisabled: {
    backgroundColor: '#E5C7C7',
  },
  deleteButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
});
