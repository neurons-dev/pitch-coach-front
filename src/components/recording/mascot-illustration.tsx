import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

const MASCOT_SOURCE = require('../../../assets/images/pcicon.png');

const COLS = 4;
const ROWS = 2;
const VARIANT_INDEX = 0;

const DISPLAY_WIDTH = 168;
const DISPLAY_HEIGHT = 188;

export function MascotIllustration() {
  const column = VARIANT_INDEX % COLS;
  const row = Math.floor(VARIANT_INDEX / COLS);

  return (
    <View style={styles.frame}>
      <Image
        source={MASCOT_SOURCE}
        style={[
          styles.sprite,
          {
            width: DISPLAY_WIDTH * COLS,
            height: DISPLAY_HEIGHT * ROWS,
            transform: [
              { translateX: -column * DISPLAY_WIDTH },
              { translateY: -row * DISPLAY_HEIGHT },
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
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
