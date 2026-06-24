import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { AppButton } from "./AppButton";
import { colors } from "../theme/colors";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  actionLabel,
  onAction
}: ScreenHeaderProps) {
  const headerProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerProgress, {
      duration: 320,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, [headerProgress]);

  const headerTranslateY = headerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0]
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: headerProgress,
          transform: [{ translateY: headerTranslateY }]
        }
      ]}
    >
      <View style={styles.topRow}>
        {onBack ? (
          <AppButton title="Back" variant="secondary" onPress={onBack} style={styles.backButton} />
        ) : null}
        {actionLabel && onAction ? (
          <AppButton
            title={actionLabel}
            variant="ghost"
            onPress={onAction}
            style={styles.actionButton}
          />
        ) : null}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 8
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 42
  },
  backButton: {
    minHeight: 40,
    paddingHorizontal: 12
  },
  actionButton: {
    minHeight: 40,
    paddingHorizontal: 8
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  }
});
