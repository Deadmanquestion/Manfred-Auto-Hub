import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedSectionHeader } from "../components/AnimatedSectionHeader";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { AppInput } from "../components/AppInput";
import { DateTimeSelector } from "../components/DateTimeSelector";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { SuccessState } from "../components/SuccessState";
import { mockServiceMenu } from "../data/mockData";
import { createServiceBooking, listServiceMenu } from "../lib/database";
import { hasSupabaseEnv } from "../lib/supabase";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";
import type { ServiceMenuItem } from "../types/ui";

export function BookServiceScreen({ navigate, goBack, cars, addMockBooking, refreshData }: ScreenProps) {
  const [services, setServices] = useState<ServiceMenuItem[]>(mockServiceMenu);
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id ?? "");
  const [selectedServiceId, setSelectedServiceId] = useState(mockServiceMenu[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successReference, setSuccessReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedService = services.find((service) => service.id === selectedServiceId);
  const selectedCar = cars.find((car) => car.id === selectedCarId);

  useEffect(() => {
    if (!hasSupabaseEnv) return;
    void listServiceMenu()
      .then((records) => {
        setServices(records);
        setSelectedServiceId((current) => records.some((record) => record.id === current) ? current : records[0]?.id ?? "");
      })
      .catch((error) => setErrorMessage(error instanceof Error ? error.message : "Unable to load services."));
  }, []);

  async function handleSubmit() {
    setErrorMessage("");
    setSuccessReference("");

    if (!selectedCarId) {
      setErrorMessage("Add or select a car before booking service.");
      return;
    }

    if (!selectedService) {
      setErrorMessage("Choose a service before submitting.");
      return;
    }

    setIsSubmitting(true);
    const referenceNumber = `MAH-SVC-${Date.now().toString().slice(-6)}`;

    try {
      if (hasSupabaseEnv) {
        const preferredDate = new Date();
        preferredDate.setDate(preferredDate.getDate() + 3);
        const bookingId = await createServiceBooking({
          car_id: selectedCarId,
          customer_notes: notes.trim(),
          estimated_price: selectedService.estimated_price,
          photo_caption: photoCaption.trim(),
          photo_url: photoUrl.trim(),
          service_catalog_id: selectedService.id,
          service_date: preferredDate.toISOString(),
          service_type: selectedService.name
        });
        await refreshData();
        setSuccessReference(`MF-SVC-${bookingId.slice(0, 6).toUpperCase()}`);
      } else {
        await addMockBooking({
          kind: "Service",
          title: selectedService.name,
          date_label: "Three days from today at this time",
          car_label: selectedCar ? `${selectedCar.make} ${selectedCar.model}` : "Saved car",
          status: "pending",
          payment_status: "unpaid",
          detail: `${photoUrl.trim() ? "Visual reference added. " : ""}${photoCaption.trim() || notes.trim() || "Waiting for workshop review."}`,
          estimated_price: selectedService.estimated_price,
          reference_number: referenceNumber
        });
        setSuccessReference(referenceNumber);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit the service request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (successReference) {
    return (
      <Screen>
        <SuccessState
          eyebrow="Service request submitted"
          title="Your service request is in the workshop queue."
          referenceNumber={successReference}
          message="The workshop team will review the selected service, notes, and preferred time before confirming the appointment."
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
      <ScreenHeader
        title="Book service"
        subtitle="Request maintenance or repair work. An admin will approve the booking."
        onBack={goBack}
      />

      <AnimatedSectionHeader eyebrow="Step 1" title="Choose a car" />

      {cars.length === 0 ? (
        <AppCard>
          <Text style={styles.carName}>Add a vehicle profile</Text>
          <Text style={styles.meta}>A saved vehicle helps the workshop prepare the right service notes.</Text>
          <AppButton title="Add car" variant="secondary" onPress={() => navigate("AddCar")} />
        </AppCard>
      ) : null}

      {cars.map((car) => (
        <AppCard
          key={car.id}
          onPress={() => setSelectedCarId(car.id)}
          style={selectedCarId === car.id ? styles.selectedCard : undefined}
        >
          <Text style={styles.carName}>{car.make} {car.model}</Text>
          <Text style={styles.meta}>{car.license_plate}</Text>
        </AppCard>
      ))}

      <AnimatedSectionHeader eyebrow="Step 2" title="Choose a service" />

      {services.map((service) => (
        <AppCard
          key={service.id}
          onPress={() => setSelectedServiceId(service.id)}
          style={selectedServiceId === service.id ? styles.selectedCard : undefined}
        >
          <View style={styles.serviceHeader}>
            <View style={styles.serviceCopy}>
              <Text style={styles.carName}>{service.name}</Text>
              <Text style={styles.meta}>{service.description}</Text>
            </View>
            <Text style={styles.price}>${service.estimated_price}</Text>
          </View>
          <Text style={styles.meta}>Estimated {service.estimated_duration_minutes} minutes</Text>
        </AppCard>
      ))}

      <AppInput
        label="Visual reference"
        placeholder="Describe any dashboard light, leak, or visible issue"
        value={photoUrl}
        onChangeText={setPhotoUrl}
      />
      <Text style={styles.helperText}>Add any visual context that helps the workshop prepare.</Text>
      <AppInput
        label="Photo caption"
        placeholder="Example: warning light on dashboard"
        value={photoCaption}
        onChangeText={setPhotoCaption}
      />
      <DateTimeSelector
        label="Preferred date and time"
        value="Three days from today at this time"
        helperText="The workshop will confirm the final appointment window."
      />
      <AppInput
        label="Notes for workshop"
        placeholder="Describe the issue or request"
        multiline
        style={styles.notes}
        value={notes}
        onChangeText={setNotes}
      />

      <View style={styles.paymentBox}>
        <Text style={styles.paymentTitle}>Payment status</Text>
        <Text style={styles.paymentText}>Payment is handled after the workshop confirms the appointment.</Text>
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <AppButton title="Submit service request" loading={isSubmitting} onPress={handleSubmit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2
  },
  carName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900"
  },
  meta: {
    color: colors.muted,
    marginTop: 5
  },
  serviceHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  serviceCopy: {
    flex: 1
  },
  price: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: "900"
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: -10
  },
  notes: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  paymentBox: {
    backgroundColor: colors.softOrange,
    borderRadius: 12,
    padding: 14
  },
  paymentTitle: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: "900"
  },
  paymentText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },
  stateBox: {
    alignItems: "center",
    gap: 8,
    padding: 16
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  }
});
