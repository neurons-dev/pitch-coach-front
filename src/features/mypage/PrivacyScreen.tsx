import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccordionItem } from '@/features/mypage/components/AccordionItem';

const SECTIONS = [
  {
    title: '수집하는 개인정보 항목',
    body: '필수 항목: 이메일 주소, 이름(닉네임), 비밀번호 · 선택 항목: 프로필 사진, 한 줄 소개 · 자동 수집: 발표 음성 데이터, 서비스 이용 기록, 접속 로그, 기기 정보',
  },
  {
    title: '개인정보 수집 및 이용 목적',
    body: '회원 가입 및 관리, 발표 음성 분석 및 피드백 제공, 서비스 개선을 위한 통계 분석 목적으로 개인정보를 이용합니다.',
  },
  {
    title: '개인정보 보유 및 이용 기간',
    body: '회원 탈퇴 시까지 보유하며, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 별도 보관합니다.',
  },
  {
    title: '개인정보의 제3자 제공',
    body: '이용자의 동의 없이 개인정보를 제3자에게 제공하지 않으며, 법령에 근거가 있는 경우에 한해 예외로 합니다.',
  },
  {
    title: '개인정보 보호 조치',
    body: '개인정보 암호화, 접근 권한 관리 등 기술적·관리적 조치를 통해 개인정보를 안전하게 보호합니다.',
  },
  {
    title: '이용자의 권리',
    body: '이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있으며 회원 탈퇴를 통해 처리 정지를 요청할 수 있습니다.',
  },
];

export default function PrivacyScreen() {
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/mypage' as never);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          onPress={goBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <MaterialIcons name="arrow-back" size={22} color="#1F2937" />
        </Pressable>
        <Text style={styles.headerTitle}>개인정보 처리방침</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {SECTIONS.map((item) => (
            <AccordionItem key={item.title} title={item.title}>
              {item.body}
            </AccordionItem>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  card: {
    paddingHorizontal: 4,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
});
