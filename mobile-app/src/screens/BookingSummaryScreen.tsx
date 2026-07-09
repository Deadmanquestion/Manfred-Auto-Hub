import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { StatusBadge } from "../components/StatusBadge";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

const services = [
  { label: "Brake inspection", price: 60 },
  { label: "Diagnostic scan", price: 50 },
  { label: "Workshop handling", price: 15 }
];

export function BookingSummaryScreen({ navigate, goBack, cars }: ScreenProps) {
  const selectedCar = cars[0];
  const subtotal = services.reduce((sum, item) => sum + item.price, 0);

  return (
    <Screen>
      <ScreenHeader
        title="Booking Summary"
        subtitle="Mock approved workshop appointment"
        onBack={goBack}
      />

      <AppCard style={styles.heroCard}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Booking ID</Text>
            <Text style={styles.heroTitle}>MAH-SVC-204811</Text>
          </View>
          <StatusBadge status="approved" />
        </View>
        <Text style={styles.muted}>Your appointment is approved in this mock demo. Payment is still a placeholder for the MVP.</Text>
      </AppCard>

      <InfoBlock
        title="Workshop details"
        rows={[
          ["Workshop", "Manfred Auto Hub"],
          ["Rating", "4.9"],
          ["Distance", "1.8 km"],
          ["Location", "Workshop reception and service bay"]
        ]}
      />

      <InfoBlock
        title="Appointment details"
        rows={[
          ["Date/time", "Tue, 25 Jun at 10:30 AM"],
          ["Status", "Approved"],
          ["Assigned team", "Senior mechanic team"],
          ["Working hours", "Mon - Sat, 8:00 AM - 6:00 PM"]
        ]}
      />

      <InfoBlock
        title="Vehicle details"
        rows={[
          ["Vehicle", selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : "Mock vehicle"],
          ["Plate", selectedCar?.license_plate ?? "MAH 0000"],
          ["Color", selectedCar?.color ?? "Not set"]
        ]}
      />

      <AppCard style={styles.priceCard}>
        <Text style={styles.cardTitle}>Services selected</Text>
        {services.map((item) => (
          <View key={item.label} style={styles.priceRow}>
            <Text style={styles.priceLabel}>{item.label}</Text>
            <Text style={styles.priceValue}>${item.price}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total estimate</Text>
          <Text style={styles.totalValue}>${subtotal}</Text>
        </View>
      </AppCard>

      <View style={styles.buttonRow}>
        <AppButton title="Track booking" onPress={() => navigate("MyBookings")} style={styles.button} />
        <AppButton title="Back home" variant="secondary" onPress={() => navigate("Home")} style={styles.button} />
      </View>
    </Screen>
  );
}

function InfoBlock({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <AppCard style={styles.infoCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.infoRows}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  flex: {
    flex: 1
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 5,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 32
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10
  },
  infoCard: {
    backgroundColor: colors.surfaceAlt
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  infoRows: {
    gap: 10,
    marginTop: 14
  },
  infoRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800"
  },
  infoValue: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right"
  },
  priceCard: {
    gap: 12
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  priceLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "800"
  },
  priceValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  divider: {
    backgroundColor: colors.border,
    height: 1
  },
  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  totalValue: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "900"
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10
  },
  button: {
    flex: 1
  }
});
