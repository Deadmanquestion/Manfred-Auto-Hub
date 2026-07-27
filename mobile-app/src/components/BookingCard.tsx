import { StyleSheet, Text, View } from "react-native";
import type { BookingSummary } from "../types/ui";
import { AppButton } from "./AppButton";
import { AppCard } from "./AppCard";
import { StatusBadge } from "./StatusBadge";
import { colors } from "../theme/colors";

interface BookingCardProps {
  booking: BookingSummary;
  cancelling?: boolean;
  onCancel?: () => void;
}

export function BookingCard({ booking, cancelling = false, onCancel }: BookingCardProps) {
  const priceLabel =
    booking.kind === "Application" ? "No fee" : `$${booking.estimated_price}`;

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={styles.kindPill}>
          <Text style={styles.kindText}>{booking.kind}</Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>
      <Text style={styles.title}>{booking.title}</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Vehicle</Text>
          <Text style={styles.infoValue}>{booking.car_label}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Date / time</Text>
          <Text style={styles.infoValue}>{booking.date_label}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Estimated price</Text>
          <Text style={styles.priceValue}>{priceLabel}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Reference</Text>
          <Text style={styles.infoValue}>{booking.reference_number}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.detail}>{booking.detail}</Text>
        {booking.kind === "Application" ? null : <StatusBadge status={booking.payment_status} />}
      </View>
      {onCancel && (booking.status === "pending" || booking.status === "approved") ? (
        <AppButton
          title={cancelling ? "Cancelling..." : "Cancel booking"}
          variant="secondary"
          loading={cancelling}
          onPress={onCancel}
        />
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  kindPill: {
    backgroundColor: colors.softOrange,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  kindText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900"
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6
  },
  infoGrid: {
    gap: 10,
    marginTop: 12
  },
  infoBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase"
  },
  infoValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
  },
  priceValue: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900"
  },
  footer: {
    alignItems: "center",
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12
  },
  detail: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    marginRight: 12
  }
});
