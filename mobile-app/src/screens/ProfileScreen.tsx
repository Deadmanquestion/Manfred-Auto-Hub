import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { StatusBadge } from "../components/StatusBadge";
import { getMockUserDisplayName } from "../lib/mockAuth";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

interface ProfileScreenProps extends ScreenProps {
  showBack?: boolean;
}

export function ProfileScreen({
  goBack,
  resetToLogin,
  mockUser,
  cars,
  bookings,
  showBack = true
}: ProfileScreenProps) {
  const userName = getMockUserDisplayName(mockUser?.fullName, mockUser?.email);
  const userEmail = mockUser?.email ?? "mock@example.com";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Screen>
      <ScreenHeader
        title="Manfred Auto Hub"
        subtitle="Your account, garage, and booking summary."
        onBack={showBack ? goBack : undefined}
      />

      <AppCard style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.meta}>{userEmail}</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>Customer account</Text>
        </View>
      </AppCard>

      <View style={styles.stats}>
        <AppCard style={styles.statCard}>
          <Text style={styles.statNumber}>{cars.length}</Text>
          <Text style={styles.statLabel}>Cars</Text>
        </AppCard>
        <AppCard style={styles.statCard}>
          <Text style={styles.statNumber}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </AppCard>
      </View>

      <AppCard>
        <Text style={styles.sectionTitle}>Latest payment status</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentText}>{bookings[0]?.title ?? "No active booking"}</Text>
          <StatusBadge status={bookings[0]?.payment_status ?? "unpaid"} />
        </View>
      </AppCard>

      <AppButton title="Log out" variant="secondary" onPress={resetToLogin} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: "center"
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.softOrange,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    width: 80
  },
  avatarText: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900"
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 14
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4
  },
  rolePill: {
    backgroundColor: colors.softBlue,
    borderRadius: 999,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  roleText: {
    color: colors.info,
    fontSize: 12,
    fontWeight: "900"
  },
  stats: {
    flexDirection: "row",
    gap: 12
  },
  statCard: {
    alignItems: "center",
    flex: 1
  },
  statNumber: {
    color: colors.primary,
    fontSize: 30,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  paymentRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14
  },
  paymentText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  }
});
