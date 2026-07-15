import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { StatusBadge } from "../components/StatusBadge";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

export function ServiceBookingSummaryScreen({ navigate, goBack, bookings }: ScreenProps) {
  const serviceBooking = bookings.find((booking) => booking.kind === "Service");

  return (
    <Screen>
      <ScreenHeader title="Service booking summary" subtitle="Review the latest service request." onBack={goBack} />
      <AppCard style={styles.summaryCard}>
        <View style={styles.row}>
          <Text style={styles.eyebrow}>Workshop service</Text>
          <StatusBadge status={serviceBooking?.status ?? "pending"} />
        </View>
        <Text style={styles.title}>{serviceBooking?.title ?? "Service request"}</Text>
        <Text style={styles.muted}>{serviceBooking?.date_label ?? "Waiting for workshop review"}</Text>
        <Text style={styles.reference}>{serviceBooking?.reference_number ?? "MAH-SVC-204811"}</Text>
      </AppCard>
      <AppButton title="View My Bookings" onPress={() => navigate("MyBookings")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong,
    gap: 10
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
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
    fontSize: 22,
    fontWeight: "900"
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  reference: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900"
  }
});
