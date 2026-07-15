import { StyleSheet, Text, View } from "react-native";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { StatusBadge } from "../components/StatusBadge";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

const revenueStreams = [
  {
    name: "Service booking",
    detail: "Routine maintenance, inspections, and repair requests",
    estimate: "$420"
  },
  {
    name: "Lift rental",
    detail: "Hourly bay access for DIY owners and freelance operators",
    estimate: "$192"
  },
  {
    name: "Tool rental",
    detail: "Add-on tool packs attached to lift bookings",
    estimate: "$54"
  },
  {
    name: "Spare parts",
    detail: "Parts reservations, pickup orders, and workshop fulfilment",
    estimate: "$310"
  },
  {
    name: "Mechanic assistant fee",
    detail: "Guided DIY help and light technician support",
    estimate: "$105"
  },
  {
    name: "Apprentice program",
    detail: "Recruitment pipeline for supervised workshop roles",
    estimate: "Strategic value"
  }
];

const sparePartsOrders = [
  "Brake pads reserved",
  "Battery replacement quote",
  "Engine oil bundle"
];

export function InvestorDashboardScreen({ goBack, bookings }: ScreenProps) {
  const serviceBookings = bookings.filter((booking) => booking.kind === "Service");
  const liftBookings = bookings.filter((booking) => booking.kind === "Lift");
  const apprenticeApplications = bookings.filter((booking) => booking.kind === "Application");
  const pendingApprovals = bookings.filter((booking) => booking.status === "pending");
  const estimatedDailyRevenue =
    bookings.reduce((sum, booking) => sum + booking.estimated_price, 0) + 18 + 35 + 310;

  return (
    <Screen>
      <ScreenHeader
        title="Business Dashboard"
        subtitle="Investor view of how Manfred Auto Hub can convert workshop activity into revenue."
        onBack={goBack}
      />

      <AppCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Investor demo mode</Text>
        <Text style={styles.heroTitle}>A workshop operating system with multiple revenue channels.</Text>
        <Text style={styles.heroText}>
          Manfred combines service booking, lift rental, parts demand, and workforce intake in one customer-facing app.
        </Text>
      </AppCard>

      <View style={styles.metricGrid}>
        <MetricCard title="Today's bookings" value={String(bookings.length)} detail="Across service, lift, and applications" />
        <MetricCard title="Lift rental requests" value={String(liftBookings.length)} detail="Bay usage and add-on potential" />
        <MetricCard title="Estimated daily revenue" value={`$${estimatedDailyRevenue}`} detail="Bookings plus parts and add-ons" highlight />
        <MetricCard title="Pending approvals" value={String(pendingApprovals.length)} detail="Items waiting for workshop review" />
        <MetricCard title="Spare parts orders" value={String(sparePartsOrders.length)} detail="Parts demand ready for follow-up" />
        <MetricCard title="Apprentice applications" value={String(apprenticeApplications.length)} detail="Talent pipeline for the shop" />
      </View>

      <Text style={styles.sectionTitle}>Revenue streams</Text>
      <View style={styles.streamStack}>
        {revenueStreams.map((stream) => (
          <AppCard key={stream.name} style={styles.streamCard}>
            <View style={styles.streamHeader}>
              <View style={styles.flex}>
                <Text style={styles.streamName}>{stream.name}</Text>
                <Text style={styles.streamDetail}>{stream.detail}</Text>
              </View>
              <Text style={styles.streamEstimate}>{stream.estimate}</Text>
            </View>
          </AppCard>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Operating snapshot</Text>
      <AppCard style={styles.snapshotCard}>
        <SnapshotRow label="Approved booking" value={serviceBookings[0]?.title ?? "Brake Inspection"} status="approved" />
        <SnapshotRow label="Pending lift request" value={liftBookings[0]?.title ?? "Basic Lift Rental"} status="pending" />
        <SnapshotRow label="Completed service" value="Engine Oil Service" status="completed" />
      </AppCard>

      <Text style={styles.sectionTitle}>Spare parts demand</Text>
      <View style={styles.partsGrid}>
        {sparePartsOrders.map((order) => (
          <AppCard key={order} style={styles.partCard}>
            <Text style={styles.partTitle}>{order}</Text>
            <Text style={styles.partDetail}>Ready for workshop follow-up</Text>
          </AppCard>
        ))}
      </View>
    </Screen>
  );
}

function MetricCard({
  title,
  value,
  detail,
  highlight = false
}: {
  title: string;
  value: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <AppCard style={[styles.metricCard, highlight ? styles.highlightMetric : undefined]}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </AppCard>
  );
}

function SnapshotRow({
  label,
  value,
  status
}: {
  label: string;
  value: string;
  status: "pending" | "approved" | "completed";
}) {
  return (
    <View style={styles.snapshotRow}>
      <View style={styles.flex}>
        <Text style={styles.snapshotLabel}>{label}</Text>
        <Text style={styles.snapshotValue}>{value}</Text>
      </View>
      <StatusBadge status={status} />
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong,
    gap: 10
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
    fontSize: 14,
    lineHeight: 21
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  metricCard: {
    backgroundColor: colors.surfaceAlt,
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 145
  },
  highlightMetric: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary
  },
  metricValue: {
    color: colors.primaryDark,
    fontSize: 27,
    fontWeight: "900"
  },
  metricTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 8
  },
  metricDetail: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  streamStack: {
    gap: 12
  },
  streamCard: {
    backgroundColor: colors.surfaceAlt
  },
  streamHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  flex: {
    flex: 1
  },
  streamName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  streamDetail: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6
  },
  streamEstimate: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right"
  },
  snapshotCard: {
    gap: 14
  },
  snapshotRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  snapshotLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  snapshotValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 4
  },
  partsGrid: {
    gap: 12
  },
  partCard: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong
  },
  partTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  partDetail: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6
  }
});
