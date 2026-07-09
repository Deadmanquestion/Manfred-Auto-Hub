import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { AppCard } from "../components/AppCard";
import { BookingCard } from "../components/BookingCard";
import { Screen } from "../components/Screen";
import { getMockUserDisplayName } from "../lib/mockAuth";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

const quickActions = [
  { title: "Book Lift", detail: "DIY bay rental", screen: "BookLift" as const },
  { title: "Book Service", detail: "Repair request", screen: "BookService" as const },
  { title: "Spare Parts", detail: "Pickup support", screen: "WorkshopDetail" as const },
  { title: "Track Booking", detail: "Status updates", screen: "MyBookings" as const }
];

const apprenticeRoles = [
  "Workshop Helper",
  "Apprentice Mechanic",
  "Spare Parts Assistant",
  "Content Creator"
];

export function HomeScreen({ navigate, mockUser, cars, bookings }: ScreenProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const ambientPulse = useRef(new Animated.Value(0)).current;
  const selectedCar = cars[0];
  const displayName = getMockUserDisplayName(mockUser?.fullName, mockUser?.email);
  const firstName = displayName.split(" ")[0] || "Driver";
  const recentBookings = bookings.slice(0, 2);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(ambientPulse, {
          duration: 2200,
          toValue: 1,
          useNativeDriver: true
        }),
        Animated.timing(ambientPulse, {
          duration: 2200,
          toValue: 0,
          useNativeDriver: true
        })
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [ambientPulse]);

  // The Home hero is the only scroll-animated area. The car glides very slightly and
  // the cyan glow drifts as the page scrolls, giving a premium feel without heavy 3D.
  const carTranslateX = scrollY.interpolate({
    inputRange: [0, 220],
    outputRange: [-12, 18],
    extrapolate: "clamp"
  });
  const carScale = scrollY.interpolate({
    inputRange: [0, 220],
    outputRange: [1, 1.04],
    extrapolate: "clamp"
  });
  const glowTranslateX = scrollY.interpolate({
    inputRange: [0, 260],
    outputRange: [-28, 26],
    extrapolate: "clamp"
  });
  const ambientGlowOpacity = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.48]
  });
  const ambientGlowScale = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.04]
  });
  const floorLineTranslateX = scrollY.interpolate({
    inputRange: [0, 220],
    outputRange: [-10, 10],
    extrapolate: "clamp"
  });

  return (
    <Screen scrollY={scrollY}>
      <View style={styles.hero}>
        <Animated.View
          pointerEvents="none"
          style={[styles.heroGlow, { transform: [{ translateX: glowTranslateX }] }]}
        />
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.eyebrow}>Manfred Auto Hub</Text>
            <Text style={styles.welcome}>Welcome back, {firstName}</Text>
          </View>
          <View style={styles.livePill}>
            <Text style={styles.livePillText}>Open</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Premium workshop care for every stage of your car.</Text>
        <Text style={styles.heroText}>Book lift bays, repair services, parts support, and workshop opportunities in one simple app.</Text>
        <Animated.View style={[styles.heroCarWrap, { transform: [{ translateX: carTranslateX }, { scale: carScale }] }]}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heroCarGlow,
              {
                opacity: ambientGlowOpacity,
                transform: [{ scale: ambientGlowScale }]
              }
            ]}
          />
          <Image
            accessibilityLabel="Manfred Auto Hub car visual"
            resizeMode="contain"
            source={require("../../assets/car-hero.webp")}
            style={styles.heroCar}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.floorLine,
              {
                transform: [{ translateX: floorLineTranslateX }]
              }
            ]}
          />
        </Animated.View>
      </View>

      <AppCard style={styles.vehicleCard} onPress={() => navigate("Vehicle")}>
        <View style={styles.cardHeader}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Default vehicle</Text>
            <Text style={styles.vehicleTitle}>
              {selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : "Add your first car"}
            </Text>
            <Text style={styles.muted}>{selectedCar?.next_service ?? "Create a vehicle profile to unlock faster bookings."}</Text>
          </View>
          <Text style={styles.vehiclePlate}>{selectedCar?.license_plate ?? "NEW"}</Text>
        </View>
      </AppCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <Text style={styles.sectionMeta}>2x2 shortcuts</Text>
      </View>
      <View style={styles.quickGrid}>
        {quickActions.map((action) => (
          <ActionCard
            key={action.title}
            title={action.title}
            detail={action.detail}
            onPress={() => navigate(action.screen)}
          />
        ))}
      </View>

      <AppCard style={styles.healthPreview} onPress={() => navigate("Vehicle")}>
        <View style={styles.cardHeader}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Car health preview</Text>
            <Text style={styles.cardTitle}>82/100 overall health</Text>
            <Text style={styles.muted}>Brakes and fluids need attention soon. Everything else looks stable in mock diagnostics.</Text>
          </View>
          <View style={styles.healthRing}>
            <Text style={styles.healthScore}>82</Text>
          </View>
        </View>
      </AppCard>

      <AppCard style={styles.statusCard} onPress={() => navigate("WorkshopDetail")}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.eyebrow}>Workshop status</Text>
            <Text style={styles.cardTitle}>Ready for bookings today</Text>
          </View>
          <Text style={styles.statusOpen}>Live</Text>
        </View>
        <View style={styles.statusGrid}>
          <StatusMetric value="Open" label="Today" />
          <StatusMetric value="2" label="Lifts available" />
          <StatusMetric value="5" label="Service slots" />
        </View>
      </AppCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent bookings</Text>
        <Text style={styles.sectionLink} onPress={() => navigate("MyBookings")}>View all</Text>
      </View>
      {recentBookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended services</Text>
        <Text style={styles.sectionMeta}>For your vehicle</Text>
      </View>
      <View style={styles.recommendationStack}>
        <Recommendation title="Brake health check" detail="Recommended before your next lift booking." price="$60" />
        <Recommendation title="Battery diagnostic" detail="Quick scan for cold-start and voltage issues." price="$45" />
      </View>

      <AppCard style={styles.apprenticeCard} onPress={() => navigate("JobApplication")}>
        <Text style={styles.eyebrow}>Join the workshop team</Text>
        <Text style={styles.cardTitle}>Apprentice and part-time access</Text>
        <Text style={styles.muted}>Manfred can collect interest from young helpers, creators, and future mechanics.</Text>
        <View style={styles.roleGrid}>
          {apprenticeRoles.map((role) => (
            <Text key={role} style={styles.rolePill}>{role}</Text>
          ))}
        </View>
      </AppCard>
    </Screen>
  );
}

function ActionCard({ title, detail, onPress }: { title: string; detail: string; onPress: () => void }) {
  return (
    <AppCard style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionAccent} />
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionMeta}>{detail}</Text>
    </AppCard>
  );
}

function StatusMetric({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statusMetric}>
      <Text style={styles.statusValue}>{value}</Text>
      <Text style={styles.statusLabel}>{label}</Text>
    </View>
  );
}

function Recommendation({ title, detail, price }: { title: string; detail: string; price: string }) {
  return (
    <AppCard style={styles.recommendationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.muted}>{detail}</Text>
        </View>
        <Text style={styles.price}>{price}</Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong,
    borderRadius: 30,
    borderWidth: 1,
    gap: 14,
    minHeight: 430,
    overflow: "hidden",
    padding: 22
  },
  heroGlow: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 260,
    opacity: 0.16,
    position: "absolute",
    right: -90,
    top: 120,
    width: 260
  },
  heroTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
    marginBottom: 5,
    textTransform: "uppercase"
  },
  welcome: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  heroTitle: {
    color: colors.text,
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 37,
    zIndex: 1
  },
  heroText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    zIndex: 1
  },
  heroCarWrap: {
    alignSelf: "center",
    height: 170,
    marginTop: 2,
    maxWidth: 380,
    width: "116%"
  },
  heroCar: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    width: "100%"
  },
  heroCarGlow: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    bottom: 8,
    height: 42,
    left: "16%",
    position: "absolute",
    right: "16%",
    zIndex: 1
  },
  floorLine: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    bottom: 7,
    height: 2,
    left: "20%",
    opacity: 0.65,
    position: "absolute",
    right: "20%",
    zIndex: 3
  },
  livePill: {
    backgroundColor: colors.softGreen,
    borderColor: colors.success,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 7
  },
  livePillText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "900"
  },
  vehicleCard: {
    backgroundColor: colors.surfaceAlt
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  flex: {
    flex: 1
  },
  vehicleTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  vehiclePlate: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900"
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7
  },
  sectionHeader: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  sectionMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  sectionLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900"
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  actionCard: {
    flexBasis: "47%",
    flexGrow: 1,
    justifyContent: "center",
    minHeight: 118
  },
  actionAccent: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    marginBottom: 14,
    width: 30
  },
  actionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  actionMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 7
  },
  healthPreview: {
    backgroundColor: colors.surfaceDark
  },
  healthRing: {
    alignItems: "center",
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    borderRadius: 34,
    borderWidth: 1,
    height: 68,
    justifyContent: "center",
    width: 68
  },
  healthScore: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: "900"
  },
  statusCard: {
    backgroundColor: colors.surfaceDark
  },
  statusOpen: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "900"
  },
  statusGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  statusMetric: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,
    padding: 12
  },
  statusValue: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: "900"
  },
  statusLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4
  },
  recommendationStack: {
    gap: 12
  },
  recommendationCard: {
    backgroundColor: colors.surfaceAlt
  },
  cardTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  price: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "900"
  },
  apprenticeCard: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong
  },
  roleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  rolePill: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 7
  }
});
