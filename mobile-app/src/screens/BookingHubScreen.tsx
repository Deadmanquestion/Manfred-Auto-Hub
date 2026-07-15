import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppCard } from "../components/AppCard";
import { AppInput } from "../components/AppInput";
import { BookingCard } from "../components/BookingCard";
import { Screen } from "../components/Screen";
import { StatusBadge } from "../components/StatusBadge";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

type FilterKey = "All" | "Lift Rental" | "Service" | "Certified";

const filters: FilterKey[] = ["All", "Lift Rental", "Service", "Certified"];

const options = [
  {
    title: "Car Lift Rental",
    tag: "Lift Rental",
    rating: "4.9",
    distance: "1.8 km",
    detail: "Reserve Lift Bay 1, Lift Bay 2, Alignment Bay, or Washing Bay with optional tools and assistant.",
    price: "From $24/hr",
    certified: true,
    route: "BookLift" as const
  },
  {
    title: "General Service",
    tag: "Service",
    rating: "4.8",
    distance: "1.8 km",
    detail: "Routine inspection, fluids, tire pressure, battery scan, and workshop notes.",
    price: "From $80",
    certified: true,
    route: "WorkshopDetail" as const
  },
  {
    title: "Brake Inspection",
    tag: "Service",
    rating: "4.9",
    distance: "1.8 km",
    detail: "Pads, rotors, brake fluid, pedal feel, and safety recommendations.",
    price: "From $60",
    certified: true,
    route: "WorkshopDetail" as const
  },
  {
    title: "Suspension Check",
    tag: "Service",
    rating: "4.7",
    distance: "1.8 km",
    detail: "Shock absorbers, bushings, control arms, noise checks, and road-feel review.",
    price: "From $75",
    certified: true,
    route: "WorkshopDetail" as const
  },
  {
    title: "Oil Change",
    tag: "Service",
    rating: "4.8",
    distance: "1.8 km",
    detail: "Engine oil, oil filter, basic inspection, and service reminder update.",
    price: "From $80",
    certified: true,
    route: "WorkshopDetail" as const
  },
  {
    title: "Spare Parts",
    tag: "Service",
    rating: "4.7",
    distance: "In workshop",
    detail: "Reserve common parts and collect after the team confirms stock.",
    price: "Quote after review",
    certified: false,
    route: "WorkshopDetail" as const
  }
];

export function BookingHubScreen({ navigate, bookings }: ScreenProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const recentBookings = bookings.slice(0, 3);

  const visibleOptions = useMemo(
    () =>
      options.filter((option) => {
        if (activeFilter === "All") {
          return true;
        }

        if (activeFilter === "Certified") {
          return option.certified;
        }

        return option.tag === activeFilter;
      }),
    [activeFilter]
  );

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Booking</Text>
        <Text style={styles.heroTitle}>Find the right workshop slot for your car.</Text>
        <Text style={styles.heroText}>Search lift rentals, repair services, and parts support from Manfred Auto Hub.</Text>
      </View>

      <AppInput label="Search" placeholder="Search lift, oil change, brake check..." />

      <View style={styles.filterRow}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterChip, isActive ? styles.filterChipActive : undefined]}
            >
              <Text style={[styles.filterText, isActive ? styles.filterTextActive : undefined]}>{filter}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Workshop options</Text>
        <Text style={styles.sectionMeta}>{visibleOptions.length} shown</Text>
      </View>
      <View style={styles.optionStack}>
        {visibleOptions.map((option) => (
          <WorkshopOption key={option.title} option={option} onPress={() => navigate(option.route)} />
        ))}
      </View>

      <AppCard style={styles.summaryCard} onPress={() => navigate("BookingSummary")}>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.eyebrow}>Booking summary</Text>
            <Text style={styles.cardTitle}>Preview a complete booking record</Text>
            <Text style={styles.muted}>Shows workshop details, appointment, vehicle, selected services, and price breakdown.</Text>
          </View>
          <StatusBadge status="approved" />
        </View>
      </AppCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent booking history</Text>
        <Text style={styles.sectionLink} onPress={() => navigate("MyBookings")}>View all</Text>
      </View>
      {recentBookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </Screen>
  );
}

function WorkshopOption({
  option,
  onPress
}: {
  option: typeof options[number];
  onPress: () => void;
}) {
  return (
    <AppCard style={styles.optionCard} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text style={styles.optionTag}>{option.tag}</Text>
          <Text style={styles.optionTitle}>{option.title}</Text>
        </View>
        <Text style={styles.price}>{option.price}</Text>
      </View>
      <Text style={styles.muted}>{option.detail}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaPill}>Rating {option.rating}</Text>
        <Text style={styles.metaPill}>{option.distance}</Text>
        {option.certified ? <Text style={styles.metaPill}>Certified</Text> : null}
      </View>
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
    marginBottom: 4,
    textTransform: "uppercase"
  },
  heroTitle: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "900",
    lineHeight: 35
  },
  heroText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  filterChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 13,
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
  optionStack: {
    gap: 12
  },
  optionCard: {
    backgroundColor: colors.surfaceAlt
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  flex: {
    flex: 1
  },
  optionTag: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 5,
    textTransform: "uppercase"
  },
  optionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  price: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "900"
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
    gap: 8,
    marginTop: 14
  },
  metaPill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.mutedLight,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  summaryCard: {
    backgroundColor: colors.softCyan
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  }
});
