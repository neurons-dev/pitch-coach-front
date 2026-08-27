import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
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

import { login } from '@/api/auth-api';

const BASE_WIDTH = 390;
const scale = Math.min(Math.max(Dimensions.get('window').width / BASE_WIDTH, 0.85), 1.15);

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('입력 확인', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await login({ email, password });
      router.replace('/(tabs)');
    } catch {
      Alert.alert('로그인 실패', '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Image
              source={require('../../../assets/images/login-character.png')}
              style={styles.character}
              resizeMode="contain"
            />
            <Text style={styles.brand}>
              <Text style={styles.brandPointOne}>P</Text>
              <Text>itch </Text>
              <Text style={styles.brandPointTwo}>C</Text>
              <Text>oach</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일"
              placeholderTextColor="rgba(31,36,48,0.5)"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호"
              placeholderTextColor="rgba(31,36,48,0.5)"
              secureTextEntry
            />

            <Pressable style={styles.loginButton} onPress={handleLogin} disabled={isLoggingIn}>
              {isLoggingIn ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>로그인</Text>
              )}
            </Pressable>

            <Pressable style={styles.signupButton} onPress={() => router.push('/signup')}>
              <Text style={styles.signupText}>
                계정이 없으신가요? <Text style={styles.signupLink}>회원가입</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 36,
  },
  character: {
    width: 120 * scale,
    height: 126 * scale,
    marginBottom: 16,
  },
  brand: {
    fontFamily: 'Nunito_900Black',
    fontSize: 24,
    color: '#1F2430',
  },
  brandPointOne: {
    color: '#5085F9',
  },
  brandPointTwo: {
    color: '#6B99FF',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 52,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#DFE7F3',
    borderRadius: 15,
    backgroundColor: '#FBFCFF',
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2430',
  },
  loginButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderRadius: 14,
    backgroundColor: '#3474F6',
    borderBottomWidth: 5,
    borderBottomColor: '#1954D8',
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  signupButton: {
    paddingVertical: 18,
  },
  signupText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9AA3B2',
  },
  signupLink: {
    fontWeight: '800',
    color: '#3474F6',
  },
});
