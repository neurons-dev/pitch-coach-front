import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { RecordingColors } from '@/constants/recording-theme';

const BAR_HEIGHTS = [12, 20, 28, 18, 32, 24, 36, 22, 30, 16, 26, 34, 20, 28, 14, 32, 24, 18, 30, 22, 26, 16, 28, 20];

type WaveformVisualizerProps = {
  active?: boolean;
};

function WaveBar({ height, index, active }: { height: number; index: number; active: boolean }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!active) {
      scale.value = 1;
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(0.45 + (index % 5) * 0.1, { duration: 350 + (index % 4) * 80 }),
        withTiming(1, { duration: 350 + (index % 3) * 80 }),
      ),
      -1,
      true,
    );
  }, [active, index, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        { height },
        animatedStyle,
      ]}
    />
  );
}

export function WaveformVisualizer({ active = true }: WaveformVisualizerProps) {
  return (
    <View style={styles.container}>
      {BAR_HEIGHTS.map((height, index) => (
        <WaveBar key={index} height={height} index={index} active={active} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 40,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  bar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: RecordingColors.waveform,
  },
});
