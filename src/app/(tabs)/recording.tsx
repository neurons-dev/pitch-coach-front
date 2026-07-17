import { StyleSheet, Text, View } from 'react-native';

export default function RecordingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>녹음</Text>
      <Text style={styles.description}>녹음 화면입니다.</Text>
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
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    fontSize: 16,
  },
});