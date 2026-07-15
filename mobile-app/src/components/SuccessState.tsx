import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { AppButton } from "./AppButton";
import { AppCard } from "./AppCard";

interface SuccessStateProps {
  eyebrow?: string;
  title: string;
  referenceNumber: string;
  message: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel: string;
  onSecondaryAction: () => void;
}

export function SuccessState({
  eyebrow = "Request received",
  title,
  referenceNumber,
  message,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction
}: SuccessStateProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>OK</Text>
      </View>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.referenceBox}>
        <Text style={styles.referenceLabel}>Reference number</Text>
        <Text style={styles.referenceNumber}>{referenceNumber}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <AppButton title={primaryActionLabel} onPress={onPrimaryAction} />
        <AppButton
          title={secondaryActionLabel}
          variant="secondary"
          onPress={onSecondaryAction}
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: 16,
    paddingVertical: 26
  },
  icon: {
    alignItems: "center",
    backgroundColor: colors.softGreen,
    borderColor: colors.success,
    borderRadius: 999,
    borderWidth: 1,
    height: 64,
    justifyContent: "center",
    width: 64
  },
  iconText: {
    color: colors.success,
    fontSize: 16,
    fontWeight: "900"
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 32,
    textAlign: "center"
  },
  referenceBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    width: "100%"
  },
  referenceLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4
  },
  referenceNumber: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "900"
  },
  message: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center"
  },
  actions: {
    gap: 10,
    width: "100%"
  }
});
