import type { ReactNode } from "react";
import { useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

export function HomeScreen({ navigate }: ScreenProps) {
  const scrollY = useRef(new Animated.Value(0)).current;

  // One shared scroll value drives the premium hero motion:
  // the car glides sideways, scales slightly, and the orange glow drifts slower than the content.
  const carTranslateX = scrollY.interpolate({
    inputRange: [0, 240],
    outputRange: [-10, 18],
    extrapolate: "clamp"
  });
  const carScale = scrollY.interpolate({
    inputRange: [0, 240],
    outputRange: [1, 1.045],
    extrapolate: "clamp"
  });
  const glowTranslateX = scrollY.interpolate({
    inputRange: [0, 260],
    outputRange: [-24, 28],
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
            <Text style={styles.brand}>Manfred Auto Hub</Text>
            <Text style={styles.heroKicker}>Modern workshop platform</Text>
          </View>
          <View style={styles.openBadge}>
            <Text style={styles.openBadgeText}>Open today</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Book service, rent a lift, or join the workshop team.</Text>
        <AnimatedCarVisual
          scale={carScale}
          translateX={carTranslateX}
        />
        <View style={styles.heroActions}>
          <AppButton title="Book Car Lift" onPress={() => navigate("BookLift")} style={styles.heroButton} />
          <AppButton
            title="Book Service"
            variant="secondary"
            onPress={() => navigate("BookService")}
            style={styles.heroButton}
          />
        </View>
      </View>

      <AnimatedSection scrollY={scrollY} start={70}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Workshop status</Text>
            <Text style={styles.sectionTitle}>Today at the garage</Text>
          </View>
        </View>
        <View style={styles.statusGrid}>
          <View style={styles.statusBox}>
            <Text style={styles.statusValue}>Open</Text>
            <Text style={styles.statusLabel}>Open Today</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusValue}>2</Text>
            <Text style={styles.statusLabel}>Lifts Available</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusValue}>5</Text>
            <Text style={styles.statusLabel}>Service Slots Left</Text>
          </View>
        </View>
      </AnimatedSection>

      <AnimatedSection scrollY={scrollY} start={190}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Booking hub</Text>
            <Text style={styles.sectionTitle}>Start your workshop request</Text>
          </View>
        </View>
        <View style={styles.bookingGrid}>
          <AppCard style={styles.bookingCard} onPress={() => navigate("BookLift")}>
            <Text style={styles.cardTitle}>Rent a Lift</Text>
            <Text style={styles.cardText}>Reserve a bay, tools, and add-ons for DIY work.</Text>
          </AppCard>
          <AppCard style={styles.bookingCard} onPress={() => navigate("BookService")}>
            <Text style={styles.cardTitle}>Book Repair</Text>
            <Text style={styles.cardText}>Request maintenance, inspection, or diagnostics.</Text>
          </AppCard>
          <AppCard style={styles.bookingCardWide} onPress={() => navigate("MyBookings")}>
            <Text style={styles.cardTitle}>Manage Bookings</Text>
            <Text style={styles.cardText}>Track lift bookings, service requests, and applications.</Text>
          </AppCard>
        </View>
      </AnimatedSection>

      <AnimatedSection scrollY={scrollY} start={320}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Why Manfred Auto Hub</Text>
            <Text style={styles.sectionTitle}>Built for a modern family workshop</Text>
          </View>
        </View>
        <View style={styles.whyStack}>
          {[
            "Flexible lift rental",
            "Verified mechanic support",
            "Apprentice opportunities",
            "Service history tracking"
          ].map((reason) => (
            <View key={reason} style={styles.whyItem}>
              <View style={styles.whyDot} />
              <Text style={styles.whyText}>{reason}</Text>
            </View>
          ))}
        </View>
      </AnimatedSection>

      <AnimatedSection scrollY={scrollY} start={460}>
        <AppCard style={styles.highlightCard} onPress={() => navigate("BookLift")}>
          <Text style={styles.sectionEyebrow}>Lift Rental Highlight</Text>
          <Text style={styles.highlightTitle}>DIY car owners can book lift bays, tools, and mechanic assistant.</Text>
          <Text style={styles.cardText}>
            Choose a bay, select an available time, accept the safety agreement, and wait for admin approval.
          </Text>
          <View style={styles.highlightMetaRow}>
            <Text style={styles.highlightMeta}>From $48</Text>
            <Text style={styles.highlightMeta}>Deposit after approval</Text>
          </View>
        </AppCard>
      </AnimatedSection>

      <AnimatedSection scrollY={scrollY} start={560}>
        <AppCard style={styles.apprenticeCard} onPress={() => navigate("Jobs")}>
          <Text style={styles.sectionEyebrow}>Apprentice Highlight</Text>
          <Text style={styles.highlightTitle}>Young people can apply for supervised workshop roles.</Text>
          <Text style={styles.cardText}>
            Collect availability, role interest, experience, guardian consent, and admin review notes in one simple flow.
          </Text>
          <AppButton title="Join the workshop team" onPress={() => navigate("Jobs")} style={styles.apprenticeButton} />
        </AppCard>
      </AnimatedSection>
    </Screen>
  );
}

function AnimatedSection({
  children,
  scrollY,
  start
}: {
  children: ReactNode;
  scrollY: Animated.Value;
  start: number;
}) {
  const opacity = scrollY.interpolate({
    inputRange: [start - 100, start],
    outputRange: [0, 1],
    extrapolate: "clamp"
  });
  const translateY = scrollY.interpolate({
    inputRange: [start - 100, start],
    outputRange: [22, 0],
    extrapolate: "clamp"
  });

  return (
    <Animated.View style={[styles.animatedSection, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

function AnimatedCarVisual({
  scale,
  translateX
}: {
  scale: Animated.AnimatedInterpolation<string | number>;
  translateX: Animated.AnimatedInterpolation<string | number>;
}) {
  return (
    <View style={styles.visualStage}>
      {/* The hero image is bundled locally so Expo Web and mobile can render it reliably.
          scrollY still drives translateX and scale so the real car keeps the premium motion. */}
      <Animated.View style={[styles.carWrap, { transform: [{ translateX }, { scale }] }]}>
        <Image
          accessibilityLabel="Sport car hero visual"
          resizeMode="contain"
          source={require("../../assets/car-hero.webp")}
          style={styles.carImage}
        />
      </Animated.View>
      <View style={styles.floorLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: 16,
    minHeight: 460,
    overflow: "hidden",
    padding: 22
  },
  heroGlow: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 240,
    opacity: 0.18,
    position: "absolute",
    right: -80,
    top: 120,
    width: 240
  },
  heroTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1
  },
  brand: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase"
  },
  heroKicker: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 4
  },
  heroTitle: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 39,
    zIndex: 1
  },
  heroText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    zIndex: 1
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
    zIndex: 1
  },
  heroButton: {
    flex: 1,
    paddingHorizontal: 10
  },
  openBadge: {
    backgroundColor: colors.softGreen,
    borderColor: colors.success,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  openBadgeText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "900"
  },
  visualStage: {
    height: 220,
    justifyContent: "flex-end",
    paddingBottom: 10,
    width: "100%"
  },
  carWrap: {
    alignSelf: "center",
    height: 170,
    justifyContent: "flex-end",
    maxWidth: 360,
    width: "112%"
  },
  carImage: {
    height: "100%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 30,
    width: "100%"
  },
  floorLine: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 2,
    opacity: 0.7,
    width: "78%"
  },
  animatedSection: {
    gap: 12
  },
  sectionHeader: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionEyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7,
    marginBottom: 4,
    textTransform: "uppercase"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  statusBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: "30%",
    flexGrow: 1,
    padding: 14
  },
  statusValue: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: "900"
  },
  statusLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  cardText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6
  },
  bookingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  bookingCard: {
    backgroundColor: colors.surfaceAlt,
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 132
  },
  bookingCardWide: {
    backgroundColor: colors.surfaceDark,
    width: "100%"
  },
  whyStack: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  whyItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  whyDot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 8,
    width: 8
  },
  whyText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "800"
  },
  highlightCard: {
    backgroundColor: colors.surfaceDark,
    gap: 10
  },
  highlightTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30
  },
  highlightMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6
  },
  highlightMeta: {
    backgroundColor: colors.softOrange,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  apprenticeCard: {
    gap: 12
  },
  apprenticeButton: {
    marginTop: 4
  }
});
