import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

interface MyCarsScreenProps extends ScreenProps {
  showBack?: boolean;
}

export function MyCarsScreen({ navigate, goBack, cars, showBack = true }: MyCarsScreenProps) {
  return (
    <Screen>
      <ScreenHeader
        title="My cars"
        subtitle="These vehicle profiles make service and lift bookings faster."
        onBack={showBack ? goBack : undefined}
        actionLabel="Add"
        onAction={() => navigate("AddCar")}
      />

      {cars.length === 0 ? (
        <AppCard>
          <Text style={styles.emptyTitle}>Add a vehicle profile</Text>
          <Text style={styles.emptyText}>Vehicle profiles make service and lift bookings easier for the workshop team.</Text>
        </AppCard>
      ) : null}

      {cars.map((car) => (
        <AppCard key={car.id}>
          <View style={styles.carHeader}>
            <View>
              <Text style={styles.carName}>{car.year} {car.make} {car.model}</Text>
              <Text style={styles.plate}>{car.license_plate}</Text>
            </View>
            <Text style={styles.color}>{car.color}</Text>
          </View>
          <Text style={styles.service}>{car.next_service}</Text>
        </AppCard>
      ))}

      <AppButton title="Add another car" onPress={() => navigate("AddCar")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  carHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  carName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  plate: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6
  },
  color: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "right"
  },
  service: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 14
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
  }
});
