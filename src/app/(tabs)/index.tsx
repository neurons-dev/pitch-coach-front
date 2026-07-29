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
      <Text style={styles.linkDescription}>Figma 22번 녹음 화면 UI를 확인할 수 있습니다.</Text>
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
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#6B9FD4',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#5A6472',
    textAlign: 'center',
  },
});
