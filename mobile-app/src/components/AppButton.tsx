import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  StyleProp,
  Text,
  ViewStyle
} from "react-native";
import { colors } from "../theme/colors";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  style
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        (pressed || disabled) && styles.pressed,
        style
      ]}
    >
      {loading ? <ActivityIndicator color="#ffffff" /> : icon}
      <Text style={[styles.text, buttonTextStyles[variant]]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: "#ff9f45",
    borderWidth: 1
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.borderStrong,
    borderWidth: 1
  },
  ghost: {
    backgroundColor: "transparent"
  },
  danger: {
    backgroundColor: colors.danger
  },
  pressed: {
    opacity: 0.72
  },
  text: {
    fontSize: 15,
    fontWeight: "900"
  },
  primaryText: {
    color: colors.white
  },
  secondaryText: {
    color: colors.text
  },
  ghostText: {
    color: colors.primary
  },
  dangerText: {
    color: colors.white
  }
});

const buttonTextStyles = {
  primary: styles.primaryText,
  secondary: styles.secondaryText,
  ghost: styles.ghostText,
  danger: styles.dangerText
};
