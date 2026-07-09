import { useEffect, useMemo, useState } from "react";
import { Platform, StatusBar, StyleSheet, useWindowDimensions, View } from "react-native";
import { BottomTabNav } from "./src/components/BottomTabNav";
import { mockBookings, mockCars } from "./src/data/mockData";
import { AddCarScreen } from "./src/screens/AddCarScreen";
import { BookingHubScreen } from "./src/screens/BookingHubScreen";
import { BookLiftScreen } from "./src/screens/BookLiftScreen";
import { BookServiceScreen } from "./src/screens/BookServiceScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { VehicleScreen } from "./src/screens/VehicleScreen";
import { AlertsScreen } from "./src/screens/AlertsScreen";
import { JobApplicationScreen } from "./src/screens/JobApplicationScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { BookingSummaryScreen } from "./src/screens/BookingSummaryScreen";
import { LiftBookingSummaryScreen } from "./src/screens/LiftBookingSummaryScreen";
import { MyBookingsScreen } from "./src/screens/MyBookingsScreen";
import { MyCarsScreen } from "./src/screens/MyCarsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ServiceBookingSummaryScreen } from "./src/screens/ServiceBookingSummaryScreen";
import { WorkshopDetailScreen } from "./src/screens/WorkshopDetailScreen";
import { colors } from "./src/theme/colors";
import type { MockUser, ScreenName, ScreenProps } from "./src/types/navigation";
import type { BookingSummary, CarSummary } from "./src/types/ui";

export default function App() {
  const { width } = useWindowDimensions();
  const [screen, setScreen] = useState<ScreenName>("Login");
  const [history, setHistory] = useState<ScreenName[]>([]);
  const [mockUser, setMockUser] = useState<MockUser | null>(null);
  const [cars, setCars] = useState<CarSummary[]>(mockCars);
  const [bookings, setBookings] = useState<BookingSummary[]>(mockBookings);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Manfred Auto Hub";
    }
  }, []);

  const navigation = useMemo<ScreenProps>(
    () => ({
      navigate: (nextScreen) => {
        setHistory((previous) => [...previous, screen]);
        setScreen(nextScreen);
      },
      goBack: () => {
        const previousScreen = history[history.length - 1];
        setHistory(history.slice(0, -1));
        setScreen(previousScreen ?? "Home");
      },
      resetToLogin: () => {
        setMockUser(null);
        setHistory([]);
        setScreen("Login");
      },
      mockUser,
      setMockUser,
      cars,
      bookings,
      addMockCar: (car) => {
        setCars((currentCars) => [
          {
            ...car,
            id: `car-${Date.now()}`
          },
          ...currentCars
        ]);
      },
      addMockBooking: (booking) => {
        setBookings((currentBookings) => [
          {
            ...booking,
            id: `booking-${Date.now()}`
          },
          ...currentBookings
        ]);
      }
    }),
    [bookings, cars, history, mockUser, screen]
  );

  const showTabs = screen !== "Login" && screen !== "Register";
  const isDesktopWeb = Platform.OS === "web" && width >= 768;

  function handleChangeTab(nextScreen: "Home" | "Booking" | "Vehicle" | "Alerts" | "Profile") {
    setHistory([]);
    setScreen(nextScreen);
  }

  function renderScreen() {
    if (screen === "Login") {
      return <LoginScreen {...navigation} />;
    }

    if (screen === "Register") {
      return <RegisterScreen {...navigation} />;
    }

    if (screen === "Home") {
      return <HomeScreen {...navigation} />;
    }

    if (screen === "Booking") {
      return <BookingHubScreen {...navigation} />;
    }

    if (screen === "Vehicle") {
      return <VehicleScreen {...navigation} />;
    }

    if (screen === "Alerts") {
      return <AlertsScreen {...navigation} />;
    }

    if (screen === "MyCars") {
      return <MyCarsScreen {...navigation} showBack={false} />;
    }

    if (screen === "AddCar") {
      return <AddCarScreen {...navigation} />;
    }

    if (screen === "BookService") {
      return <BookServiceScreen {...navigation} />;
    }

    if (screen === "BookLift") {
      return <BookLiftScreen {...navigation} />;
    }

    if (screen === "MyBookings") {
      return <MyBookingsScreen {...navigation} />;
    }

    if (screen === "LiftBookingSummary") {
      return <LiftBookingSummaryScreen {...navigation} />;
    }

    if (screen === "ServiceBookingSummary") {
      return <ServiceBookingSummaryScreen {...navigation} />;
    }

    if (screen === "Jobs") {
      return <JobApplicationScreen {...navigation} showBack={false} />;
    }

    if (screen === "JobApplication") {
      return <JobApplicationScreen {...navigation} />;
    }

    if (screen === "WorkshopDetail") {
      return <WorkshopDetailScreen {...navigation} />;
    }

    if (screen === "BookingSummary") {
      return <BookingSummaryScreen {...navigation} />;
    }

    if (screen === "Profile") {
      return <ProfileScreen {...navigation} showBack={false} />;
    }

    return <HomeScreen {...navigation} />;
  }

  return (
    <View style={[styles.webBackground, isDesktopWeb ? styles.webBackgroundDesktop : undefined]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View
        style={[
          styles.appShell,
          isDesktopWeb ? styles.appShellDesktop : undefined
        ]}
      >
        {renderScreen()}
        {showTabs ? <BottomTabNav activeScreen={screen} onChangeTab={handleChangeTab} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webBackground: {
    backgroundColor: colors.background,
    flex: 1,
    minHeight: 0
  },
  webBackgroundDesktop: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 24
  },
  appShell: {
    backgroundColor: colors.background,
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    width: "100%"
  },
  appShellDesktop: {
    alignSelf: "center",
    borderColor: colors.borderStrong,
    borderRadius: 34,
    borderWidth: 1,
    flex: 1,
    maxHeight: 900,
    maxWidth: 430,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    width: 430
  }
});
