import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

type AlertFilter = "All" | "Unread";

const alerts = [
  {
    title: "Booking confirmed",
    detail: "Brake inspection has been approved by the workshop team.",
    time: "Today, 9:12 AM",
    unread: true,
    action: "View summary" as const
  },
  {
    title: "Lift booking pending approval",
    detail: "Your Lift Bay 1 request is waiting for admin review.",
    time: "Today, 8:40 AM",
    unread: true,
    action: "Track booking" as const
  },
  {
    title: "Service reminder",
    detail: "Oil service is due soon for your selected vehicle.",
    time: "Yesterday",
    unread: false,
    action: "Book service" as const
  },
  {
    title: "Parts ready for pickup",
    detail: "Your requested brake pads are ready at Manfred Auto Hub.",
    time: "2 days ago",
    unread: false,
    action: "Workshop details" as const
  }
];

export function AlertsScreen({ navigate }: ScreenProps) {
  const [filter, setFilter] = useState<AlertFilter>("All");
  const visibleAlerts = useMemo(
    () => alerts.filter((alert) => (filter === "Unread" ? alert.unread : true)),
    [filter]
  );

  function handleAction(action: typeof alerts[number]["action"]) {
    if (action === "Book service") {
      navigate("BookService");
      return;
    }

    if (action === "Workshop details") {
      navigate("WorkshopDetail");
      return;
    }

    if (action === "View summary") {
      navigate("BookingSummary");
      return;
    }

    navigate("MyBookings");
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Alerts</Text>
        <Text style={styles.heroTitle}>Workshop updates you can act on.</Text>
        <Text style={styles.heroText}>Customer notifications for approvals, reminders, completed work, and parts pickup.</Text>
      </View>

      <View style={styles.filterRow}>
        {(["All", "Unread"] as AlertFilter[]).map((item) => {
          const isActive = filter === item;

          return (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filterChip, isActive ? styles.filterChipActive : undefined]}
            >
              <Text style={[styles.filterText, isActive ? styles.filterTextActive : undefined]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      {visibleAlerts.map((alert) => (
        <AppCard key={`${alert.title}-${alert.time}`} style={styles.alertCard}>
          <View style={styles.header}>
            <View style={[styles.alertIcon, alert.unread ? styles.unreadIcon : undefined]} />
            <View style={styles.copy}>
              <View style={styles.titleRow}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                {alert.unread ? <Text style={styles.unreadPill}>New</Text> : null}
              </View>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          </View>
          <Text style={styles.alertDetail}>{alert.detail}</Text>
          <AppButton
            title={alert.action}
            variant="secondary"
            onPress={() => handleAction(alert.action)}
            style={styles.actionButton}
          />
        </AppCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong,
    borderRadius: 28,
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
  filterRow: {
    flexDirection: "row",
    gap: 10
  },
  filterChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 9
  },
  filterChipActive: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary
  },
  filterText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "900"
  },
  filterTextActive: {
    color: colors.primaryDark
  },
  alertCard: {
    gap: 12
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  alertIcon: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    height: 38,
    width: 38
  },
  unreadIcon: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary
  },
  copy: {
    flex: 1
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between"
  },
  alertTitle: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "900"
  },
  unreadPill: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  alertTime: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 4
  },
  alertDetail: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  actionButton: {
    minHeight: 44
  }
});
