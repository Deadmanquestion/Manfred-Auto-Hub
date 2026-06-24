import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedSectionHeader } from "../components/AnimatedSectionHeader";
import { AppButton } from "../components/AppButton";
import { AppCard } from "../components/AppCard";
import { AppInput } from "../components/AppInput";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { SuccessState } from "../components/SuccessState";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";
import type { ApplicationRole } from "../types/ui";

const roleOptions: Array<{ label: string; value: ApplicationRole }> = [
  { label: "Workshop helper", value: "workshop_helper" },
  { label: "Car wash crew", value: "car_wash_crew" },
  { label: "Apprentice mechanic", value: "apprentice_mechanic" },
  { label: "Content creator", value: "content_creator" },
  { label: "Spare parts assistant", value: "spare_parts_assistant" },
  { label: "Customer service helper", value: "customer_service_helper" }
];

const roleDetails: Record<ApplicationRole, string> = {
  workshop_helper: "Hands-on help with bay setup, tools, and simple workshop tasks.",
  car_wash_crew: "Detailing, wash prep, and customer vehicle presentation.",
  apprentice_mechanic: "Learn diagnostics, maintenance basics, and garage discipline.",
  content_creator: "Capture workshop stories, short videos, and social updates.",
  spare_parts_assistant: "Help with parts lookup, stock checks, and order preparation.",
  customer_service_helper: "Support bookings, customer updates, and front-desk flow."
};

const workingDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface JobApplicationScreenProps extends ScreenProps {
  showBack?: boolean;
}

export function JobApplicationScreen({
  navigate,
  goBack,
  addMockBooking,
  showBack = true
}: JobApplicationScreenProps) {
  const [roleType, setRoleType] = useState<ApplicationRole>("apprentice_mechanic");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTime, setAvailableTime] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [reasonForApplying, setReasonForApplying] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [guardianConsent, setGuardianConsent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successReference, setSuccessReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedAge = Number(age);
  const isUnder18 = Number.isFinite(parsedAge) && parsedAge > 0 && parsedAge < 18;

  function toggleDay(day: string) {
    setAvailableDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day]
    );
  }

  async function handleSubmit() {
    setErrorMessage("");
    setSuccessReference("");

    if (!fullName.trim() || !age.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage("Enter your full name, age, phone number, and email.");
      return;
    }

    if (!Number.isFinite(parsedAge) || parsedAge <= 0) {
      setErrorMessage("Enter a valid age.");
      return;
    }

    if (availableDays.length === 0 || !availableTime.trim()) {
      setErrorMessage("Choose your available working days and available time.");
      return;
    }

    if (!reasonForApplying.trim() || !emergencyContact.trim()) {
      setErrorMessage("Enter your reason for applying and emergency contact.");
      return;
    }

    if (isUnder18 && !guardianConsent) {
      setErrorMessage("Guardian consent is required for applicants under 18.");
      return;
    }

    setIsSubmitting(true);
    const referenceNumber = `MAH-JOB-${Date.now().toString().slice(-6)}`;
    const selectedRoleLabel =
      roleOptions.find((role) => role.value === roleType)?.label ?? "Workshop application";

    addMockBooking({
      kind: "Application",
      title: `${selectedRoleLabel} application`,
      date_label: "Submitted just now",
      car_label: "Workshop team",
      status: "pending",
      payment_status: "unpaid",
      detail: `Available ${availableDays.join(", ")} - ${availableTime.trim()}`,
      estimated_price: 0,
      reference_number: referenceNumber
    });

    setSuccessReference(referenceNumber);
    setIsSubmitting(false);
  }

  if (successReference) {
    return (
      <Screen>
        <SuccessState
          eyebrow="Application received"
          title="Your workshop application has been sent."
          referenceNumber={successReference}
          message="The workshop team will review your role choice, availability, and guardian consent if required. The next step may be an interview."
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
      <ScreenHeader title="Join the workshop" onBack={showBack ? goBack : undefined} />

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Manfred Auto Hub youth program</Text>
        <Text style={styles.heroTitle}>Start around real cars, real tools, and a real team.</Text>
        <Text style={styles.heroText}>
          Tell the workshop when you can help, what role fits you, and why you want to join.
        </Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>1</Text>
          <Text style={styles.progressLabel}>Contact</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>2</Text>
          <Text style={styles.progressLabel}>Availability</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>3</Text>
          <Text style={styles.progressLabel}>Role</Text>
        </View>
      </View>

      <AnimatedSectionHeader eyebrow="Step 1" title="Applicant details" />

      <AppInput label="Full name" placeholder="Your full name" value={fullName} onChangeText={setFullName} />
      <AppInput label="Age" placeholder="18" keyboardType="number-pad" value={age} onChangeText={setAge} />
      <AppInput label="Phone number" placeholder="+65 8123 4567" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <AppInput
        label="Email"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <AnimatedSectionHeader eyebrow="Step 2" title="Available working days" />
      <View style={styles.optionGrid}>
        {workingDays.map((day) => (
          <AppCard
            key={day}
            onPress={() => toggleDay(day)}
            style={[styles.optionCard, availableDays.includes(day) ? styles.selectedCard : undefined]}
          >
            <Text style={styles.optionText}>{day}</Text>
          </AppCard>
        ))}
      </View>

      <AppInput label="Available time" placeholder="Weekdays 4 PM - 8 PM, Saturdays full day" value={availableTime} onChangeText={setAvailableTime} />

      <AnimatedSectionHeader eyebrow="Step 3" title="Interested role" />
      <View style={styles.roleGrid}>
        {roleOptions.map((role) => (
          <AppCard
            key={role.value}
            onPress={() => setRoleType(role.value)}
            style={[styles.roleCard, roleType === role.value ? styles.selectedCard : undefined]}
          >
            <Text style={styles.roleTitle}>{role.label}</Text>
            <Text style={styles.roleText}>{roleDetails[role.value]}</Text>
          </AppCard>
        ))}
      </View>

      <AnimatedSectionHeader eyebrow="Step 4" title="Your story" />

      <AppInput
        label="Previous experience"
        placeholder="Tell us about any workshop, car care, customer service, or content experience"
        multiline
        style={styles.message}
        value={previousExperience}
        onChangeText={setPreviousExperience}
      />
      <AppInput
        label="Reason for applying"
        placeholder="Why do you want to join the workshop?"
        multiline
        style={styles.message}
        value={reasonForApplying}
        onChangeText={setReasonForApplying}
      />
      <AppInput
        label="Emergency contact"
        placeholder="Name and phone number"
        value={emergencyContact}
        onChangeText={setEmergencyContact}
      />

      {isUnder18 ? (
        <AppCard
          onPress={() => setGuardianConsent((currentValue) => !currentValue)}
          style={guardianConsent ? styles.selectedCard : undefined}
        >
          <Text style={styles.roleTitle}>Guardian consent required</Text>
          <Text style={styles.roleText}>
            {guardianConsent
              ? "Guardian consent confirmed."
              : "Tap to confirm a parent or guardian has approved this application."}
          </Text>
        </AppCard>
      ) : null}

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Application status</Text>
        <Text style={styles.noticeText}>New applications start as pending. Admins can mark them for interview, approve, or reject.</Text>
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <AppButton title="Submit application" loading={isSubmitting} onPress={handleSubmit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.border,
    borderRadius: 24,
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
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34
  },
  heroText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 12
  },
  progressItem: {
    alignItems: "center",
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    padding: 10
  },
  progressNumber: {
    color: colors.primaryDark,
    fontSize: 18,
    fontWeight: "900"
  },
  progressLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  optionCard: {
    backgroundColor: colors.surfaceAlt,
    minWidth: 72,
    padding: 12
  },
  optionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center"
  },
  roleGrid: {
    gap: 10
  },
  roleCard: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 16
  },
  selectedCard: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 2
  },
  roleTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  roleText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8
  },
  message: {
    minHeight: 110,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  notice: {
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
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  }
});
