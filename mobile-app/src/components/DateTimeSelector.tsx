import { StyleSheet, Text, View } from "react-native";
import { AppCard } from "./AppCard";
import { colors } from "../theme/colors";

interface DateTimeSelectorProps {
  label: string;
  value: string;
  helperText?: string;
}

export function DateTimeSelector({ label, value, helperText }: DateTimeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <AppCard style={styles.selector}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.placeholder}>Date and time picker placeholder</Text>
      </AppCard>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 7
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900"
  },
  selector: {
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 16
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  placeholder: {
    color: colors.muted,
    fontSize: 13
  },
  helper: {
    color: colors.muted,
    fontSize: 12
  }
});
