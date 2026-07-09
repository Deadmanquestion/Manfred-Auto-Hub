import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

interface AppCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function AppCard({ children, onPress, style }: AppCardProps) {
  const pressProgress = useRef(new Animated.Value(1)).current;
  const hoverProgress = useRef(new Animated.Value(0)).current;
  const [isHovered, setIsHovered] = useState(false);

  function animatePress(toValue: number) {
    Animated.spring(pressProgress, {
      friction: 7,
      tension: 120,
      toValue,
      useNativeDriver: true
    }).start();
  }

  function animateHover(toValue: number) {
    Animated.timing(hoverProgress, {
      duration: 180,
      toValue,
      useNativeDriver: true
    }).start();
  }

  const hoverTranslateY = hoverProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3]
  });

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onHoverIn={() => {
          setIsHovered(true);
          animateHover(1);
        }}
        onHoverOut={() => {
          setIsHovered(false);
          animateHover(0);
        }}
        onPressIn={() => animatePress(0.975)}
        onPressOut={() => animatePress(1)}
        onPress={onPress}
        style={styles.pressable}
      >
        <Animated.View
          style={[
            styles.card,
            styles.clickableCard,
            isHovered ? styles.hoveredCard : undefined,
            style,
            { transform: [{ translateY: hoverTranslateY }, { scale: pressProgress }] }
          ]}
        >
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
  },
  clickableCard: {
    cursor: "pointer"
  } as ViewStyle,
  hoveredCard: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.26
  }
});
