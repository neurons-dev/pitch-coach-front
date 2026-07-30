import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RecordingColors } from '@/constants/recording-theme';

type ControlBarProps = {
  isPaused: boolean;
  onTogglePause?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
};

export function ControlBar({ isPaused, onTogglePause, onStop, onRestart }: ControlBarProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isPaused ? '녹음 재개' : '녹음 일시정지'}
        onPress={onTogglePause}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
        <MaterialIcons
          name={isPaused ? 'play-arrow' : 'pause'}
          size={30}
          color={RecordingColors.controlIcon}
        />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="녹음 종료"
        onPress={onStop}
        style={({ pressed }) => [styles.stopButton, pressed && styles.pressed]}>
        <View style={styles.stopSquare} />
        <Text style={styles.stopLabel}>종료</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="다시 시작"
        onPress={onRestart}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
        <MaterialIcons name="replay" size={26} color={RecordingColors.controlIcon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingTop: 8,
    paddingBottom: 36,
  },
  secondaryButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RecordingColors.controlSecondary,
  },
  stopButton: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: RecordingColors.stopButton,
    gap: 6,
  },
  stopSquare: {
    width: 16,
    height: 16,
    borderRadius: 2,
    backgroundColor: RecordingColors.stopIcon,
  },
  stopLabel: {
    color: RecordingColors.stopIcon,
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});
