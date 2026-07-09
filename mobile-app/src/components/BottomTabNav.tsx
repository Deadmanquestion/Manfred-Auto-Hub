import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import type { ScreenName } from "../types/navigation";

type MainTab = "Home" | "Booking" | "Vehicle" | "Alerts" | "Profile";

interface BottomTabNavProps {
  activeScreen: ScreenName;
  onChangeTab: (screen: MainTab) => void;
}

const tabs: Array<{ label: string; screen: MainTab; match: ScreenName[] }> = [
  { label: "Home", screen: "Home", match: ["Home"] },
  { label: "Booking", screen: "Booking", match: ["Booking", "BookLift", "BookService", "MyBookings", "WorkshopDetail", "BookingSummary", "LiftBookingSummary", "ServiceBookingSummary"] },
  { label: "Vehicle", screen: "Vehicle", match: ["Vehicle", "MyCars", "AddCar"] },
  { label: "Alerts", screen: "Alerts", match: ["Alerts"] },
  { label: "Profile", screen: "Profile", match: ["Profile"] }
];

export function BottomTabNav({ activeScreen, onChangeTab }: BottomTabNavProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.match.includes(activeScreen);

        return (
          <Pressable
            accessibilityRole="button"
            key={tab.screen}
            onPress={() => onChangeTab(tab.screen)}
            style={[styles.tab, isActive ? styles.activeTab : undefined]}
          >
            <Text style={[styles.tabText, isActive ? styles.activeText : undefined]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderStrong,
    borderTopWidth: 1,
    flexDirection: "row",
    maxWidth: 430,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%"
  },
  tab: {
    alignItems: "center",
    borderRadius: 12,
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 4
  },
  activeTab: {
    backgroundColor: colors.softCyan,
    borderColor: colors.primary,
    borderWidth: 1
  },
  tabText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900"
  },
  activeText: {
    color: colors.primaryDark
  }
});
