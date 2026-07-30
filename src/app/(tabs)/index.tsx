import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pitch Coach</Text>
      <Text style={styles.description}>피치코치 홈 화면입니다.</Text>

      <Pressable
        style={styles.linkButton}
        onPress={() => router.push('/recording' as never)}>
        <Text style={styles.linkText}>녹음 화면 미리보기</Text>
      </Pressable>

      <Pressable
        style={[styles.linkButton, styles.secondaryButton]}
        onPress={() => router.push('/analysis' as never)}>
        <Text style={styles.linkText}>분석 화면 미리보기</Text>
      </Pressable>

      <Pressable
        style={[styles.linkButton, styles.secondaryButton]}
        onPress={() => router.push('/result' as never)}>
        <Text style={styles.linkText}>결과 화면 미리보기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    fontSize: 16,
  },
  linkButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#6B9FD4',
    minWidth: 220,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#5B8DEF',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
