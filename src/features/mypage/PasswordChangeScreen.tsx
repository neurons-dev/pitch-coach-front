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
import { changePassword } from '@/api/user-api';

export default function PasswordChangeScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/mypage' as never);
    }
  };

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      Alert.alert('입력 확인', '모든 항목을 입력해주세요.');
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 64) {
      Alert.alert('입력 확인', '새 비밀번호는 8~64자로 입력해주세요.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      Alert.alert('입력 확인', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword });
      Alert.alert('변경 완료', '비밀번호가 변경되었습니다.', [{ text: '확인', onPress: goBack }]);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.';
      Alert.alert('변경 실패', message);
    } finally {
      setIsSubmitting(false);
    }
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
          <Text style={styles.headerTitle}>비밀번호 변경</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="현재 비밀번호 입력"
              placeholderTextColor="#9AA3B2"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="새 비밀번호 (8자 이상)"
              placeholderTextColor="#9AA3B2"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={newPasswordConfirm}
              onChangeText={setNewPasswordConfirm}
              placeholder="새 비밀번호 확인"
              placeholderTextColor="#9AA3B2"
              secureTextEntry
            />
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>비밀번호 변경하기</Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  form: {
    gap: 14,
  },
  input: {
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
  submitButton: {
    height: 56,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#3474F6',
    borderBottomWidth: 5,
    borderBottomColor: '#1954D8',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
});
