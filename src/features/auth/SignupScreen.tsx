import { router } from 'expo-router';
import { useState } from 'react';
import {
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

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleSignup = () => {
    if (!name || !email || !password || !passwordConfirm) {
      Alert.alert('입력 확인', '모든 항목을 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('입력 확인', '비밀번호가 일치하지 않습니다.');
      return;
    }

    Alert.alert('회원가입 완료', '회원가입이 완료되었습니다.', [
      {
        text: '확인',
        onPress: () => router.replace('/(tabs)'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.description}>계정을 만들어 발표 연습을 시작해보세요.</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="이름"
              placeholderTextColor="#9AA3B2"
            />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일"
              placeholderTextColor="#9AA3B2"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호"
              placeholderTextColor="#9AA3B2"
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              placeholder="비밀번호 확인"
              placeholderTextColor="#9AA3B2"
              secureTextEntry
            />

            <Pressable style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>회원가입</Text>
            </Pressable>

            <Pressable style={styles.loginLinkButton} onPress={() => router.replace('/login')}>
              <Text style={styles.loginLinkText}>
                이미 계정이 있으신가요? <Text style={styles.loginLink}>로그인</Text>
              </Text>
            </Pressable>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#222B3A',
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
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
  },
  signupButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#3474F6',
    borderBottomWidth: 5,
    borderBottomColor: '#1954D8',
  },
  signupButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  loginLinkButton: {
    paddingVertical: 18,
  },
  loginLinkText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9AA3B2',
  },
  loginLink: {
    fontWeight: '800',
    color: '#3474F6',
  },
});
