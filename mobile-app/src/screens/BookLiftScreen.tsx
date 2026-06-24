import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedSectionHeader } from "../components/AnimatedSectionHeader";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { AppInput } from "../components/AppInput";
import { DateTimeSelector } from "../components/DateTimeSelector";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { SuccessState } from "../components/SuccessState";
import { mockLifts } from "../data/mockData";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

const liftPackages = [
  {
    id: "basic",
    name: "Basic Lift Rental",
    description: "Lift access for quick DIY inspection or small jobs.",
    price: 48
  },
  {
    id: "tools",
    name: "Lift + Tools",
    description: "Lift access with basic hand tools and trolley jack support.",
    price: 68
  },
  {
    id: "assisted",
    name: "Assisted DIY",
    description: "Lift rental plus light guidance from the workshop team.",
    price: 95
  },
  {
    id: "night",
    name: "Night Slot",
    description: "After-hours bay request for approved regular customers.",
    price: 120
  }
];

const timeSlots = [
  "Today, 10:00 AM - 12:00 PM",
  "Today, 2:00 PM - 4:00 PM",
  "Tomorrow, 9:00 AM - 11:00 AM",
  "Saturday, 1:00 PM - 3:00 PM"
];

export function BookLiftScreen({ navigate, goBack, cars, addMockBooking }: ScreenProps) {
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id ?? "");
  const [selectedLiftId, setSelectedLiftId] = useState(mockLifts[0]?.id ?? "");
  const [selectedPackageId, setSelectedPackageId] = useState(liftPackages[0].id);
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]);
  const [includeTools, setIncludeTools] = useState(false);
  const [includeAssistant, setIncludeAssistant] = useState(false);
  const [safetyAccepted, setSafetyAccepted] = useState(false);
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successReference, setSuccessReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedLift = mockLifts.find((lift) => lift.id === selectedLiftId);
  const selectedPackage = liftPackages.find((item) => item.id === selectedPackageId) ?? liftPackages[0];
  const selectedCar = cars.find((car) => car.id === selectedCarId);
  const toolPrice = includeTools ? 18 : 0;
  const assistantPrice = includeAssistant ? 35 : 0;
  const estimatedTotal = selectedPackage.price + toolPrice + assistantPrice;

  async function handleSubmit() {
    setErrorMessage("");
    setSuccessReference("");

    if (!selectedLiftId) {
      setErrorMessage("Select an available lift before submitting.");
      return;
    }

    if (!selectedCarId) {
      setErrorMessage("Add or select a car before requesting the lift.");
      return;
    }

    if (!safetyAccepted) {
      setErrorMessage("Accept the safety agreement before requesting the lift.");
      return;
    }

    setIsSubmitting(true);
    const referenceNumber = `MAH-LIFT-${Date.now().toString().slice(-6)}`;

    addMockBooking({
      kind: "Lift",
      title: `${selectedLift?.name ?? "Lift bay"} - ${selectedPackage.name}`,
      date_label: selectedSlot,
      car_label: selectedCar ? `${selectedCar.make} ${selectedCar.model}` : "Saved car",
      status: "pending",
      payment_status: "unpaid",
      detail: `${includeTools ? "Tools added. " : ""}${includeAssistant ? "Mechanic assistant added. " : ""}${notes.trim() || "Waiting for admin approval."}`,
      estimated_price: estimatedTotal,
      reference_number: referenceNumber
    });

    setSuccessReference(referenceNumber);
    setIsSubmitting(false);
  }

  if (successReference) {
    return (
      <Screen>
        <SuccessState
          eyebrow="Lift request submitted"
          title="Your lift booking is pending approval."
          referenceNumber={successReference}
          message="The workshop team will check bay availability, safety requirements, and add-ons before approving this mock request."
          primaryActionLabel="View My Bookings"
          onPrimaryAction={() => navigate("MyBookings")}
          secondaryActionLabel="Back Home"
          onSecondaryAction={() => navigate("Home")}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Book car lift" onBack={goBack} />

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>DIY workshop bay</Text>
        <Text style={styles.heroTitle}>Reserve a pro lift without calling the shop.</Text>
        <Text style={styles.heroText}>
          Pick a bay, choose an available slot, and send the request for workshop approval.
        </Text>
        <View style={styles.heroFacts}>
          <View style={styles.factBox}>
            <Text style={styles.factValue}>15 min</Text>
            <Text style={styles.factLabel}>Buffer after each booking</Text>
          </View>
          <View style={styles.factBox}>
            <Text style={styles.factValue}>8-6</Text>
            <Text style={styles.factLabel}>Workshop hours</Text>
          </View>
        </View>
      </View>

      <AppCard style={styles.hoursCard}>
        <View>
          <Text style={styles.noticeTitle}>Opening hours</Text>
          <Text style={styles.noticeText}>Monday to Saturday, 8:00 AM - 6:00 PM</Text>
        </View>
        <View style={styles.openPill}>
          <Text style={styles.openPillText}>Open today</Text>
        </View>
      </AppCard>

      <AnimatedSectionHeader eyebrow="Step 1" title="Choose a lift bay" />

      {mockLifts.map((lift) => (
        <AppCard
          key={lift.id}
          onPress={() => {
            setSelectedLiftId(lift.id);
          }}
          style={selectedLiftId === lift.id ? styles.selectedCard : undefined}
        >
          <View style={styles.row}>
            <View>
              <Text style={styles.title}>{lift.name}</Text>
              <Text style={styles.meta}>{lift.location_label}</Text>
            </View>
            <View style={styles.pricePill}>
              <Text style={styles.price}>${lift.hourly_rate}/hr</Text>
            </View>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specText}>Max {lift.max_vehicle_weight_kg} kg</Text>
            <Text style={styles.specText}>Admin approval</Text>
          </View>
        </AppCard>
      ))}

      <AnimatedSectionHeader eyebrow="Step 2" title="Choose a package" />

      {liftPackages.map((item) => (
        <AppCard
          key={item.id}
          onPress={() => setSelectedPackageId(item.id)}
          style={[styles.slotCard, selectedPackageId === item.id ? styles.selectedCard : undefined]}
        >
          <View style={styles.row}>
            <View style={styles.packageCopy}>
              <Text style={styles.slotLabel}>{item.name}</Text>
              <Text style={styles.meta}>{item.description}</Text>
            </View>
            <Text style={styles.carYear}>${item.price}</Text>
          </View>
        </AppCard>
      ))}

      <AnimatedSectionHeader eyebrow="Step 3" title="Available time slots" />

      <DateTimeSelector
        label="Preferred date"
        value="Date picker placeholder"
        helperText="A real calendar picker can be added later."
      />
      <View style={styles.optionGrid}>
        {timeSlots.map((slot) => (
          <AppCard
            key={slot}
            onPress={() => setSelectedSlot(slot)}
            style={[styles.timeCard, selectedSlot === slot ? styles.selectedCard : undefined]}
          >
            <Text style={styles.chipLabel}>Available</Text>
            <Text style={styles.optionText}>{slot}</Text>
          </AppCard>
        ))}
      </View>

      <AnimatedSectionHeader eyebrow="Step 4" title="Add-ons" />

      <View style={styles.quickAddons}>
        <AppCard
          onPress={() => setIncludeTools((currentValue) => !currentValue)}
          style={[styles.addonCard, includeTools ? styles.selectedCard : undefined]}
        >
          <Text style={styles.title}>Tool rental</Text>
          <Text style={styles.meta}>Basic hand tools, trolley jack, and creeper.</Text>
          <Text style={styles.addonPrice}>+$18</Text>
        </AppCard>
        <AppCard
          onPress={() => setIncludeAssistant((currentValue) => !currentValue)}
          style={[styles.addonCard, includeAssistant ? styles.selectedCard : undefined]}
        >
          <Text style={styles.title}>Mechanic assistant</Text>
          <Text style={styles.meta}>Light guidance from a workshop team member.</Text>
          <Text style={styles.addonPrice}>+$35</Text>
        </AppCard>
      </View>

      <AnimatedSectionHeader eyebrow="Step 5" title="Select vehicle" />
      {cars.length === 0 ? (
        <AppCard>
          <Text style={styles.title}>No car selected</Text>
          <Text style={styles.meta}>You can still request a lift, or add a car first.</Text>
          <AppButton title="Add car" variant="secondary" onPress={() => navigate("AddCar")} />
        </AppCard>
      ) : null}

      {cars.map((car) => (
        <AppCard
          key={car.id}
          onPress={() => setSelectedCarId(car.id)}
          style={selectedCarId === car.id ? styles.selectedCard : undefined}
        >
          <View style={styles.row}>
            <View>
              <Text style={styles.title}>{car.make} {car.model}</Text>
              <Text style={styles.meta}>{car.license_plate}</Text>
            </View>
            <Text style={styles.carYear}>{car.year}</Text>
          </View>
        </AppCard>
      ))}

      <AppInput
        label="Notes for workshop"
        placeholder="Tell us what you plan to use the lift for"
        multiline
        style={styles.notes}
        value={notes}
        onChangeText={setNotes}
      />

      <View style={styles.summaryBox}>
        <View>
          <Text style={styles.noticeTitle}>Booking summary</Text>
          <Text style={styles.noticeText}>{selectedLift?.name ?? "Choose a lift"} - {selectedPackage.name} - {selectedSlot}</Text>
          <Text style={styles.depositText}>Deposit may be required after admin approval.</Text>
        </View>
        <View style={styles.summaryPriceBox}>
          <Text style={styles.summaryPrice}>${estimatedTotal}</Text>
          <Text style={styles.summaryMeta}>Estimate</Text>
        </View>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Safety notice</Text>
        <Text style={styles.noticeText}>Use jack stands where required, wear eye protection, and wait for staff approval before raising a vehicle.</Text>
      </View>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>First-time user approval</Text>
        <Text style={styles.noticeText}>First-time lift users may need a short staff orientation before the booking is approved.</Text>
      </View>

      <View style={styles.photoReminder}>
        <Text style={styles.noticeTitle}>Before / after photo reminder</Text>
        <Text style={styles.noticeText}>Take clear photos before and after your DIY work so the workshop can verify the bay condition.</Text>
      </View>

      <AppCard
        onPress={() => setSafetyAccepted((currentValue) => !currentValue)}
        style={safetyAccepted ? styles.safetyAcceptedCard : styles.safetyCard}
      >
        <View style={styles.safetyRow}>
          <View style={safetyAccepted ? styles.checkboxChecked : styles.checkbox}>
            <Text style={styles.checkboxText}>{safetyAccepted ? "OK" : ""}</Text>
          </View>
          <View style={styles.safetyCopy}>
            <Text style={styles.title}>I accept the lift safety agreement</Text>
            <Text style={styles.meta}>I will follow workshop instructions, use proper supports, and ask staff before operating the lift.</Text>
          </View>
        </View>
      </AppCard>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <AppButton
        title={safetyAccepted ? "Request lift booking" : "Accept safety agreement to continue"}
        disabled={!safetyAccepted}
        loading={isSubmitting}
        onPress={handleSubmit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
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
  heroFacts: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4
  },
  factBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    padding: 12
  },
  factValue: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900"
  },
  factLabel: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4
  },
  hoursCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  openPill: {
    backgroundColor: colors.softGreen,
    borderColor: colors.success,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  openPillText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "900"
  },
  sectionHeader: {
    gap: 4
  },
  sectionStep: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.primarySoft
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 5
  },
  price: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900"
  },
  pricePill: {
    backgroundColor: colors.softOrange,
    borderColor: colors.primary,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  specRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14
  },
  specText: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  slotCard: {
    backgroundColor: colors.surfaceAlt
  },
  slotLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 22
  },
  packageCopy: {
    flex: 1
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  timeCard: {
    backgroundColor: colors.surfaceAlt,
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 78,
    paddingVertical: 14
  },
  chipLabel: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
    marginBottom: 6,
    textTransform: "uppercase"
  },
  optionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18
  },
  quickAddons: {
    flexDirection: "row",
    gap: 10
  },
  addonCard: {
    backgroundColor: colors.surfaceAlt,
    flex: 1
  },
  addonPrice: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12
  },
  carYear: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900"
  },
  notice: {
    backgroundColor: colors.softBlue,
    borderColor: colors.info,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14
  },
  photoReminder: {
    backgroundColor: colors.softOrange,
    borderColor: colors.primary,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14
  },
  noticeTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  noticeText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },
  depositText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 8
  },
  summaryBox: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.borderStrong,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    padding: 16
  },
  summaryPriceBox: {
    alignItems: "flex-end"
  },
  summaryPrice: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: "900"
  },
  summaryMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800"
  },
  safetyCard: {
    backgroundColor: colors.surfaceAlt
  },
  safetyAcceptedCard: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 2
  },
  safetyRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12
  },
  checkbox: {
    alignItems: "center",
    borderColor: colors.borderStrong,
    borderRadius: 8,
    borderWidth: 2,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  checkboxChecked: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 2,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  checkboxText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900"
  },
  safetyCopy: {
    flex: 1
  },
  stateBox: {
    alignItems: "center",
    gap: 8,
    padding: 16
  },
  notes: {
    minHeight: 92,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  }
});
