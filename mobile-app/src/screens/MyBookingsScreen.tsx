import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { BookingCard } from "../components/BookingCard";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";
import type { BookingSummary } from "../types/ui";

export function MyBookingsScreen({ navigate, goBack, bookings, cancelBooking }: ScreenProps) {
  const [cancellingId, setCancellingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const liftBookings = bookings.filter((booking) => booking.kind === "Lift");
  const serviceBookings = bookings.filter((booking) => booking.kind === "Service");
  const applications = bookings.filter((booking) => booking.kind === "Application");

  return (
    <Screen>
      <ScreenHeader
        title="My bookings"
        subtitle="Track service requests, lift rentals, approval status, and payment status."
        onBack={goBack}
      />

      <View style={styles.actions}>
        <AppButton title="Book service" onPress={() => navigate("BookService")} style={styles.actionButton} />
        <AppButton title="Book lift" variant="secondary" onPress={() => navigate("BookLift")} style={styles.actionButton} />
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryNumber}>{bookings.length}</Text>
          <Text style={styles.summaryLabel}>Total bookings</Text>
        </View>
        <View>
          <Text style={styles.summaryNumber}>
            {bookings.filter((booking) => booking.status === "pending").length}
          </Text>
          <Text style={styles.summaryLabel}>Pending approval</Text>
        </View>
      </View>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <BookingSection
        emptyActionLabel="Book a lift"
        emptyMessage="Reserve a lift bay, tools, or assisted DIY package and it will appear here."
        onEmptyAction={() => navigate("BookLift")}
        records={liftBookings}
        title="Lift Bookings"
        cancellingId={cancellingId}
        onCancel={handleCancel}
      />
      <BookingSection
        emptyActionLabel="Book service"
        emptyMessage="Request maintenance or repair work and track the workshop review here."
        onEmptyAction={() => navigate("BookService")}
        records={serviceBookings}
        title="Service Bookings"
        cancellingId={cancellingId}
        onCancel={handleCancel}
      />
      <BookingSection
        emptyActionLabel="Join apprentice"
        emptyMessage="Submit a workshop role or apprentice application and follow its status here."
        onEmptyAction={() => navigate("JobApplication")}
        records={applications}
        title="Job Applications"
        cancellingId={cancellingId}
        onCancel={handleCancel}
      />
    </Screen>
  );

  async function handleCancel(booking: BookingSummary) {
    setErrorMessage("");
    setCancellingId(booking.id);
    try {
      await cancelBooking(booking);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to cancel this booking.");
    } finally {
      setCancellingId("");
    }
  }
}

function BookingSection(props: {
  title: string;
  records: BookingSummary[];
  emptyMessage: string;
  emptyActionLabel: string;
  onEmptyAction: () => void;
  cancellingId: string;
  onCancel: (booking: BookingSummary) => Promise<void>;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{props.title}</Text>
        <Text style={styles.sectionCount}>{props.records.length}</Text>
      </View>
      {props.records.length === 0 ? (
        <AppCard style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Ready for new activity</Text>
          <Text style={styles.emptyText}>{props.emptyMessage}</Text>
          <AppButton
            title={props.emptyActionLabel}
            variant="secondary"
            onPress={props.onEmptyAction}
          />
        </AppCard>
      ) : null}
      {props.records.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          cancelling={props.cancellingId === booking.id}
          onCancel={booking.kind === "Application" ? undefined : () => void props.onCancel(booking)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 10
  },
  actionButton: {
    flex: 1
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 16
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
  section: {
    gap: 12
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900"
  },
  sectionCount: {
    backgroundColor: colors.softOrange,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  emptyCard: {
    gap: 12
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  }
});
