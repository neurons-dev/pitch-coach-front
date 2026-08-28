import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const MASCOT_SOURCE = require('../../assets/images/pcicon.png');
const MASCOT_RECORDING_SOURCE = require('../../assets/images/mascot-recording.png');
const MASCOT_RECORDING_GRAY_SOURCE = require('../../assets/images/mascot-recording-gray.png');
const MASCOT_RECORDING_RATIO = 822 / 711;
const MASCOT_RECORDING_WIDTH = 210;

const MASCOT_RESULT_SOURCE = require('../../assets/images/mascot-result.png');
const MASCOT_RESULT_RATIO = 375 / 472;
const MASCOT_RESULT_WIDTH = 160;

const COLS = 4;
const ROWS = 2;

const CELL_WIDTH = 168;
const CELL_HEIGHT = 188;

// 스프라이트 각 칸 하단에 "시안 0X" 라벨이 있어서 위쪽 76%만 보여준다.
const VISIBLE_RATIO = 0.76;

type MascotIllustrationProps = {
  variantIndex?: number;
  size?: 'md' | 'sm';
  scale?: number;
  tone?: 'color' | 'gray';
};

export function MascotIllustration({
  variantIndex = 0,
  size = 'md',
  scale: scaleProp,
  tone = 'color',
}: MascotIllustrationProps) {
  const scale = scaleProp ?? (size === 'sm' ? 0.72 : 1);

  if (variantIndex === 0) {
    const width = MASCOT_RECORDING_WIDTH * scale;
    return (
      <Image
        source={tone === 'gray' ? MASCOT_RECORDING_GRAY_SOURCE : MASCOT_RECORDING_SOURCE}
        style={{ width, height: width / MASCOT_RECORDING_RATIO }}
        contentFit="contain"
      />
    );
  }

  if (variantIndex === 1) {
    const width = MASCOT_RESULT_WIDTH * scale;
    return (
      <Image
        source={MASCOT_RESULT_SOURCE}
        style={{ width, height: width / MASCOT_RESULT_RATIO }}
        contentFit="contain"
      />
    );
  }

  const column = variantIndex % COLS;
  const row = Math.floor(variantIndex / COLS);

  return (
    <View
      style={[
        styles.frame,
        {
          width: CELL_WIDTH * scale,
          height: CELL_HEIGHT * VISIBLE_RATIO * scale,
        },
      ]}>
      <Image
        source={MASCOT_SOURCE}
        style={[
          styles.sprite,
          {
            width: CELL_WIDTH * COLS * scale,
            height: CELL_HEIGHT * ROWS * scale,
            transform: [
              { translateX: -column * CELL_WIDTH * scale },
              { translateY: -row * CELL_HEIGHT * scale },
            ],
          },
        ]}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
  sprite: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
