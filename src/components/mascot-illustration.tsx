import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const MASCOT_SOURCE = require('../../assets/images/pcicon.png');

const COLS = 4;
const ROWS = 2;

const CELL_WIDTH = 168;
const CELL_HEIGHT = 188;

// 스프라이트 각 칸 하단에 "시안 0X" 라벨이 있어서 위쪽 76%만 보여준다.
const VISIBLE_RATIO = 0.76;

type MascotIllustrationProps = {
  variantIndex?: number;
  size?: 'md' | 'sm';
};

export function MascotIllustration({ variantIndex = 0, size = 'md' }: MascotIllustrationProps) {
  const column = variantIndex % COLS;
  const row = Math.floor(variantIndex / COLS);
  const scale = size === 'sm' ? 0.72 : 1;

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
