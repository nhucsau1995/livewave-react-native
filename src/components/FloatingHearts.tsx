import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '../theme/tokens';
import { Ion } from './Icon';

export type HeartsHandle = { burst: (n?: number) => void };

const tints = [colors.white, colors.support, '#F2B8D4', colors.accentTint];

// Hearts that rise and fade on the right edge of the video. burst() adds one or more.
export const FloatingHearts = forwardRef<HeartsHandle>(function FloatingHearts(_, ref) {
  const [hearts, setHearts] = useState<{ id: number; v: Animated.Value; x: number; tint: string }[]>([]);
  const seq = useRef(0);

  useImperativeHandle(ref, () => ({
    burst: (n = 1) => {
      for (let i = 0; i < n; i++) {
        const id = ++seq.current;
        const v = new Animated.Value(0);
        setHearts((h) => [...h.slice(-14), { id, v, x: (id * 37) % 40, tint: tints[id % tints.length] }]);
        Animated.timing(v, { toValue: 1, duration: 2200 + (id % 5) * 160, delay: i * 140, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() =>
          setHearts((h) => h.filter((x) => x.id !== id)),
        );
      }
    },
  }));

  return (
    <View pointerEvents="none" style={{ position: 'absolute', right: 14, bottom: 120, width: 60, height: 320 }}>
      {hearts.map((h) => (
        <Animated.View
          key={h.id}
          style={{
            position: 'absolute',
            bottom: 0,
            right: h.x,
            opacity: h.v.interpolate({ inputRange: [0, 0.1, 0.75, 1], outputRange: [0, 1, 0.9, 0] }),
            transform: [
              { translateY: h.v.interpolate({ inputRange: [0, 1], outputRange: [0, -300] }) },
              { translateX: h.v.interpolate({ inputRange: [0, 0.3, 0.6, 1], outputRange: [0, -10, 8, -6] }) },
              { scale: h.v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0.4, 1.1, 0.9] }) },
            ],
          }}
        >
          <Ion name="heart" size={28} color={h.tint} />
        </Animated.View>
      ))}
    </View>
  );
});
