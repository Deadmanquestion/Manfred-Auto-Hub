import { StyleSheet, Text, View } from "react-native";
import { AnimatedSectionHeader } from "../components/AnimatedSectionHeader";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

export function BookingHubScreen({ navigate, bookings }: ScreenProps) {
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Booking hub</Text>
        <Text style={styles.heroTitle}>Choose what you need from the workshop.</Text>
        <Text style={styles.heroText}>
          Reserve a lift bay, book service work, or review every request in one place.
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>{bookings.length}</Text>
          <Text style={styles.summaryLabel}>Total records</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNumber}>{pendingCount}</Text>
          <Text style={styles.summaryLabel}>Pending review</Text>
        </View>
      </View>

      <AnimatedSectionHeader eyebrow="Booking options" title="Start a request" />

      <View style={styles.cardStack}>
        <AppCard style={styles.actionCard} onPress={() => navigate("BookLift")}>
          <Text style={styles.cardKicker}>Main feature</Text>
          <Text style={styles.cardTitle}>Book Car Lift</Text>
          <Text style={styles.cardText}>
            Select a bay, package, add-ons, available slot, and safety agreement.
          </Text>
        </AppCard>
        <AppCard style={styles.actionCard} onPress={() => navigate("BookService")}>
          <Text style={styles.cardKicker}>Maintenance</Text>
          <Text style={styles.cardTitle}>Book Service</Text>
          <Text style={styles.cardText}>
            Request inspection, oil change, diagnostics, or brake service.
          </Text>
        </AppCard>
        <AppCard style={styles.actionCard} onPress={() => navigate("MyBookings")}>
          <Text style={styles.cardKicker}>Records</Text>
          <Text style={styles.cardTitle}>My Bookings</Text>
          <Text style={styles.cardText}>
            View lift bookings, service bookings, and job applications by section.
          </Text>
        </AppCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 10,
    padding: 22
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34
  },
  heroText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10
  },
  summaryBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    padding: 14
  },
  summaryNumber: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900"
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  },
  cardStack: {
    gap: 12
  },
  actionCard: {
    gap: 8
  },
  cardKicker: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  cardTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  cardText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21
  }
});
