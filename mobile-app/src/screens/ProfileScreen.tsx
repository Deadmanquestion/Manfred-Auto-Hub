import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { getMockUserDisplayName } from "../lib/mockAuth";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

interface ProfileScreenProps extends ScreenProps {
  showBack?: boolean;
}

export function ProfileScreen({
  navigate,
  resetToLogin,
  mockUser,
  cars,
  bookings,
}: ProfileScreenProps) {
  const userName = getMockUserDisplayName(mockUser?.fullName, mockUser?.email);
  const userEmail = mockUser?.email ?? "mock@example.com";
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const serviceCount = bookings.filter((booking) => booking.kind === "Service").length;
  const activeBookings = bookings.filter((booking) => booking.status === "pending" || booking.status === "approved").length;

  return (
    <Screen>
      <AppCard style={styles.profileHero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
        <Text style={styles.memberPill}>Manfred customer profile</Text>
      </AppCard>

      <View style={styles.stats}>
        <Stat value={String(serviceCount)} label="Services" />
        <Stat value={String(cars.length)} label="Vehicles" />
        <Stat value={String(activeBookings)} label="Active" />
      </View>

      <View style={styles.menuStack}>
        <MenuCard title="My Vehicles" detail="Manage saved car profiles" onPress={() => navigate("MyCars")} />
        <MenuCard title="Settings" detail="Prototype preferences placeholder" />
        <MenuCard title="Notifications" detail="Service reminders and booking alerts" onPress={() => navigate("Alerts")} />
        <MenuCard title="Help & Support" detail="Contact the workshop team" />
      </View>

      <AppButton title="Log out" variant="secondary" onPress={resetToLogin} />
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <AppCard style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </AppCard>
  );
}

function MenuCard({ title, detail, onPress }: { title: string; detail: string; onPress?: () => void }) {
  return (
    <AppCard style={styles.menuCard} onPress={onPress}>
      <View style={styles.menuDot} />
      <View style={styles.menuCopy}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDetail}>{detail}</Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  profileHero: {
    alignItems: "center",
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    borderRadius: 44,
    borderWidth: 1,
    height: 88,
    justifyContent: "center",
    width: 88
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900"
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 15
  },
  email: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 5
  },
  memberPill: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.accent,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  stats: {
    flexDirection: "row",
    gap: 10
  },
  statCard: {
    alignItems: "center",
    flex: 1,
    padding: 14
  },
  statValue: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
    textTransform: "uppercase"
  },
  menuStack: {
    gap: 12
  },
  menuCard: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  menuDot: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    width: 30
  },
  menuCopy: {
    flex: 1
  },
  menuTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  menuDetail: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 5
  }
});
