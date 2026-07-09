import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

const services = ["General Service", "Brake Inspection", "Suspension Check", "Oil Change", "Spare Parts"];
const packages = ["Basic Lift Rental", "Lift + Tools", "Assisted DIY", "Alignment Bay"];
const technicians = ["Senior mechanic team", "Electrical diagnostic support", "Apprentice supervision"];
const reviews = [
  { name: "Daniel", text: "Clear approval process and useful DIY lift support." },
  { name: "Mei", text: "Easy to understand booking flow and friendly workshop team." }
];

export function WorkshopDetailScreen({ navigate, goBack }: ScreenProps) {
  return (
    <Screen>
      <ScreenHeader
        title="Manfred Auto Hub"
        subtitle="Workshop and service detail"
        onBack={goBack}
      />

      <AppCard style={styles.heroCard}>
        <Text style={styles.eyebrow}>Premium family workshop</Text>
        <Text style={styles.heroTitle}>Manfred Auto Hub</Text>
        <Text style={styles.muted}>Service booking, DIY lift rental, parts pickup, and supervised apprentice opportunities.</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaPill}>Rating 4.9</Text>
          <Text style={styles.metaPill}>1.8 km away</Text>
          <Text style={styles.metaPill}>Certified bays</Text>
        </View>
        <View style={styles.buttonRow}>
          <AppButton title="Book lift" onPress={() => navigate("BookLift")} style={styles.button} />
          <AppButton title="Book service" variant="secondary" onPress={() => navigate("BookService")} style={styles.button} />
        </View>
      </AppCard>

      <View style={styles.grid}>
        <InfoCard title="Working hours" detail="Mon - Sat, 8:00 AM - 6:00 PM" />
        <InfoCard title="Location" detail="Manfred Auto Hub, workshop reception and lift bay entrance" />
      </View>

      <DetailSection title="Services offered" items={services} />
      <DetailSection title="Lift packages" items={packages} />
      <DetailSection title="Technicians" items={technicians} />

      <Text style={styles.sectionTitle}>Reviews</Text>
      <View style={styles.stack}>
        {reviews.map((review) => (
          <AppCard key={review.name} style={styles.reviewCard}>
            <Text style={styles.cardTitle}>{review.name}</Text>
            <Text style={styles.muted}>{review.text}</Text>
          </AppCard>
        ))}
      </View>
    </Screen>
  );
}

function InfoCard({ title, detail }: { title: string; detail: string }) {
  return (
    <AppCard style={styles.infoCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.muted}>{detail}</Text>
    </AppCard>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <AppCard style={styles.listCard}>
        {items.map((item) => (
          <View key={item} style={styles.listItem}>
            <View style={styles.dot} />
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong,
    gap: 12
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
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38
  },
  muted: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  metaPill: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4
  },
  button: {
    flex: 1,
    minHeight: 46
  },
  grid: {
    gap: 12
  },
  infoCard: {
    backgroundColor: colors.surfaceAlt
  },
  stack: {
    gap: 12
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  listCard: {
    gap: 12
  },
  listItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  dot: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 8,
    width: 8
  },
  listText: {
    color: colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "800"
  },
  reviewCard: {
    backgroundColor: colors.surfaceAlt
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  }
});
