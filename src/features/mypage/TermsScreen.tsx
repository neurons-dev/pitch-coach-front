import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccordionItem } from '@/features/mypage/components/AccordionItem';

const TERMS = [
  {
    title: '제1조 (목적)',
    body: '이 약관은 Pitch Coach(이하 "회사")가 제공하는 AI 발표 코칭 서비스(이하 "서비스")의 이용 조건 및 절차, 회사와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제2조 (정의)',
    body: '이 약관에서 사용하는 용어의 정의는 관련 법령 및 서비스 내 별도 안내에서 정하는 바에 따릅니다.',
  },
  {
    title: '제3조 (약관의 효력 및 변경)',
    body: '이 약관은 서비스 화면에 게시함으로써 효력이 발생하며, 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.',
  },
  {
    title: '제4조 (서비스 이용)',
    body: '이용자는 회사가 정한 절차에 따라 서비스를 이용할 수 있으며, 서비스의 내용은 운영상 필요에 따라 변경될 수 있습니다.',
  },
  {
    title: '제5조 (회원의 의무)',
    body: '이용자는 관련 법령과 이 약관을 준수해야 하며, 타인의 정보를 도용하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.',
  },
  {
    title: '제6조 (저작권)',
    body: '서비스 내에서 제공되는 콘텐츠에 대한 저작권은 회사 또는 정당한 권리자에게 있으며, 무단 복제·배포를 금지합니다.',
  },
  {
    title: '제7조 (면책 조항)',
    body: '회사는 천재지변 등 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임이 면제됩니다.',
  },
];

export default function TermsScreen() {
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
        <Text style={styles.headerTitle}>이용약관</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {TERMS.map((item) => (
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
