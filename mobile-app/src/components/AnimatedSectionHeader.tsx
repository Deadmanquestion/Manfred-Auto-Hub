import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

interface AnimatedSectionHeaderProps {
  eyebrow?: string;
  title: string;
}

export function AnimatedSectionHeader({ eyebrow, title }: AnimatedSectionHeaderProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      duration: 280,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, [progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0]
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: progress,
          transform: [{ translateY }]
        }
      ]}
    >
      <View style={styles.accentLine} />
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 2
  },
  accentLine: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 34,
    opacity: 0.9,
    width: 3
  },
  copy: {
    flex: 1,
    gap: 3
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  }
});
