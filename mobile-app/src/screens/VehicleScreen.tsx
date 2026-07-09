import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

const componentStatuses = [
  { name: "Engine", status: "Good", detail: "No critical mock issues", score: "92", tone: "success" },
  { name: "Brakes", status: "Check soon", detail: "Inspection recommended", score: "74", tone: "warning" },
  { name: "Battery", status: "Good", detail: "Voltage looks stable", score: "88", tone: "success" },
  { name: "Tires", status: "Monitor", detail: "Rotation due soon", score: "79", tone: "info" },
  { name: "Fluids", status: "Service", detail: "Oil change due soon", score: "68", tone: "warning" }
];

const toneStyles = {
  success: { backgroundColor: colors.success },
  warning: { backgroundColor: colors.warning },
  info: { backgroundColor: colors.info }
};

export function VehicleScreen({ navigate, cars }: ScreenProps) {
  const selectedCar = cars[0];
  const vehicleLabel = selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : "Add your first vehicle";

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Vehicle dashboard</Text>
        <Text style={styles.heroTitle}>{vehicleLabel}</Text>
        <Text style={styles.heroText}>Mock car health, reminders, and recommended actions for the workshop demo.</Text>
        <View style={styles.heroActions}>
          <AppButton title="My Vehicles" variant="secondary" onPress={() => navigate("MyCars")} style={styles.heroButton} />
          <AppButton title="Book Service" onPress={() => navigate("BookService")} style={styles.heroButton} />
        </View>
      </View>

      <AppCard style={styles.healthCard}>
        <View style={styles.scoreCircle}>
          <Text style={styles.score}>82</Text>
          <Text style={styles.scoreLabel}>/100</Text>
        </View>
        <View style={styles.healthCopy}>
          <Text style={styles.cardTitle}>Overall vehicle health</Text>
          <Text style={styles.muted}>Healthy enough for daily driving, with brakes and fluids due for attention soon.</Text>
        </View>
      </AppCard>

      <Text style={styles.sectionTitle}>Component status</Text>
      <View style={styles.componentGrid}>
        {componentStatuses.map((component) => (
          <AppCard key={component.name} style={styles.componentCard} onPress={() => navigate("BookService")}>
            <View style={styles.componentTop}>
              <View style={[styles.statusDot, toneStyles[component.tone as keyof typeof toneStyles]]} />
              <Text style={styles.componentScore}>{component.score}</Text>
            </View>
            <Text style={styles.componentName}>{component.name}</Text>
            <Text style={styles.componentStatus}>{component.status}</Text>
            <Text style={styles.mutedSmall}>{component.detail}</Text>
          </AppCard>
        ))}
      </View>

      <AppCard style={styles.actionsCard}>
        <Text style={styles.eyebrow}>Recommended actions</Text>
        <Text style={styles.cardTitle}>Brake inspection and oil service</Text>
        <Text style={styles.muted}>
          This is mock guidance for the prototype, showing how Manfred can later become a service history assistant.
        </Text>
        <AppButton title="Book recommended service" onPress={() => navigate("BookService")} style={styles.cta} />
      </AppCard>

      <Text style={styles.sectionTitle}>Service reminders</Text>
      <View style={styles.reminderStack}>
        <Reminder title="Oil service" detail="Due in 2 weeks" />
        <Reminder title="Tire rotation" detail="Recommended before the next road trip" />
      </View>
    </Screen>
  );
}

function Reminder({ title, detail }: { title: string; detail: string }) {
  return (
    <AppCard style={styles.reminderCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.muted}>{detail}</Text>
    </AppCard>
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
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36
  },
  heroText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6
  },
  heroButton: {
    flex: 1,
    minHeight: 46
  },
  healthCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    flexDirection: "row",
    gap: 16
  },
  scoreCircle: {
    alignItems: "center",
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    borderRadius: 42,
    borderWidth: 1,
    height: 84,
    justifyContent: "center",
    width: 84
  },
  score: {
    color: colors.primaryDark,
    fontSize: 28,
    fontWeight: "900"
  },
  scoreLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900"
  },
  healthCopy: {
    flex: 1
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  componentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  componentCard: {
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 150
  },
  componentTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  statusDot: {
    borderRadius: 999,
    height: 10,
    width: 10
  },
  componentScore: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900"
  },
  componentName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  componentStatus: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 6
  },
  mutedSmall: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7
  },
  actionsCard: {
    backgroundColor: colors.surfaceDark,
    gap: 8
  },
  cta: {
    marginTop: 8
  },
  reminderStack: {
    gap: 12
  },
  reminderCard: {
    backgroundColor: colors.surfaceAlt
  }
});
