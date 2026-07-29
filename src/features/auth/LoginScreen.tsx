import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('입력 확인', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    router.replace('/(tabs)');
  };

  const handleKakaoLogin = () => {
    Alert.alert('준비 중', '카카오 로그인은 준비 중입니다.');
  };

  const handleGoogleLogin = () => {
    Alert.alert('준비 중', '구글 로그인은 준비 중입니다.');
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
              <Text>resentation </Text>
              <Text style={styles.brandPointTwo}>C</Text>
              <Text>oach</Text>
            </Text>

            <Text style={styles.subtitle}>발표가 자신감으로 바뀌는 순간</Text>

            <Image
              source={require('../../../assets/images/pc-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
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

            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.divider} />
            </View>

            <Pressable style={styles.kakaoButton} onPress={handleKakaoLogin}>
              <Image
                source={require('../../../assets/images/kakao-icon.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.kakaoButtonText}>카카오로 계속하기</Text>
            </Pressable>

            <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
              <Image
                source={require('../../../assets/images/google-icon.png')}
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleButtonText}>구글로 계속하기</Text>
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
    backgroundColor: '#FFFFFF',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: '#EAF1FE',
  },
  character: {
    width: 132,
    height: 139,
    marginBottom: 8,
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
  subtitle: {
    fontFamily: 'NotoSansKR_700Bold',
    marginTop: 6,
    fontSize: 13,
    color: '#2F6FED',
  },
  logo: {
    width: 88,
    height: 88,
    marginTop: 16,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 24,
  },
  input: {
    height: 52,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E9F5',
    borderRadius: 16,
    backgroundColor: '#F7F9FC',
    fontFamily: 'NotoSansKR_600SemiBold',
    fontSize: 14,
    color: '#1F2430',
  },
  loginButton: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: '#2F6FED',
    borderBottomWidth: 5,
    borderBottomColor: '#1849A8',
  },
  loginButtonText: {
    fontFamily: 'NotoSansKR_900Black',
    fontSize: 16,
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E9F5',
  },
  dividerText: {
    fontFamily: 'NotoSansKR_700Bold',
    fontSize: 12,
    color: '#9CA3AF',
  },
  kakaoButton: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#FEE500',
    borderBottomWidth: 5,
    borderBottomColor: '#D4B800',
  },
  kakaoButtonText: {
    fontFamily: 'NotoSansKR_900Black',
    fontSize: 14,
    color: '#1F2430',
  },
  googleButton: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#E5E9F5',
    borderBottomWidth: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    fontFamily: 'NotoSansKR_900Black',
    fontSize: 14,
    color: '#1F2430',
  },
  socialIcon: {
    width: 18,
    height: 18,
  },
  signupButton: {
    paddingVertical: 18,
  },
  signupText: {
    fontFamily: 'NotoSansKR_600SemiBold',
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
  },
  signupLink: {
    fontFamily: 'NotoSansKR_900Black',
    color: '#2F6FED',
  },
});
