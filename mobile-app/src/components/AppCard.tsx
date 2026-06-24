import type { ReactNode } from "react";
import { useRef } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

interface AppCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function AppCard({ children, onPress, style }: AppCardProps) {
  const pressProgress = useRef(new Animated.Value(1)).current;

  function animatePress(toValue: number) {
    Animated.spring(pressProgress, {
      friction: 7,
      tension: 120,
      toValue,
      useNativeDriver: true
    }).start();
  }

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPressIn={() => animatePress(0.975)}
        onPressOut={() => animatePress(1)}
        onPress={onPress}
        style={styles.pressable}
      >
        <Animated.View style={[styles.card, style, { transform: [{ scale: pressProgress }] }]}>
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%"
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24
  }
});
