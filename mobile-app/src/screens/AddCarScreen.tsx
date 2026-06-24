import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { SuccessState } from "../components/SuccessState";
import { colors } from "../theme/colors";
import type { ScreenProps } from "../types/navigation";

export function AddCarScreen({ navigate, goBack, addMockCar }: ScreenProps) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successReference, setSuccessReference] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleSaveCar() {
    setErrorMessage("");
    setSuccessReference("");

    if (!make.trim() || !model.trim()) {
      setErrorMessage("Enter the car make and model.");
      return;
    }

    const parsedYear = year.trim() ? Number(year.trim()) : undefined;

    if (parsedYear && (Number.isNaN(parsedYear) || parsedYear < 1886)) {
      setErrorMessage("Enter a valid car year.");
      return;
    }

    setIsSaving(true);

    addMockCar({
      make: make.trim(),
      model: model.trim(),
      year: parsedYear ?? new Date().getFullYear(),
      license_plate: licensePlate.trim() || "No plate saved",
      color: color.trim() || "Not specified",
      next_service: notes.trim() || "No service notes yet"
    });

    setSuccessReference(`MAH-CAR-${Date.now().toString().slice(-6)}`);
    setIsSaving(false);
  }

  if (successReference) {
    return (
      <Screen>
        <SuccessState
          eyebrow="Car profile saved"
          title="Your car is ready for bookings."
          referenceNumber={successReference}
          message="This mock car profile has been added to My Cars for the current prototype session. You can now use it when booking a service or car lift."
          primaryActionLabel="View My Cars"
          onPrimaryAction={() => navigate("MyCars")}
          secondaryActionLabel="Back Home"
          onSecondaryAction={() => navigate("Home")}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title="Add car"
        subtitle="Save the basics now. More details can be added later."
        onBack={goBack}
      />

      <AppInput label="Make" placeholder="Toyota" value={make} onChangeText={setMake} />
      <AppInput label="Model" placeholder="Corolla Altis" value={model} onChangeText={setModel} />
      <AppInput label="Year" placeholder="2019" keyboardType="number-pad" value={year} onChangeText={setYear} />
      <AppInput
        label="License plate"
        placeholder="SMA 4821K"
        autoCapitalize="characters"
        value={licensePlate}
        onChangeText={setLicensePlate}
      />
      <AppInput label="Color" placeholder="Pearl white" value={color} onChangeText={setColor} />
      <AppInput
        label="Notes"
        placeholder="Anything the workshop should know"
        multiline
        style={styles.notes}
        value={notes}
        onChangeText={setNotes}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <AppButton title="Save car" loading={isSaving} onPress={handleSaveCar} />
      <Text style={styles.note}>Mock mode: the car is saved locally for this demo session.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notes: {
    minHeight: 92,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  note: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center"
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  }
});
