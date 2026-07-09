import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";
import { colors } from "../theme/colors";

interface ScreenProps {
  children: ReactNode;
  scrollY?: Animated.Value;
}

export function Screen({ children, scrollY }: ScreenProps) {
  const enterProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enterProgress.setValue(0);
    Animated.timing(enterProgress, {
      duration: 360,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, [enterProgress]);

  const enterTranslateY = enterProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0]
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        // Pages can pass a scrollY Animated.Value to build lightweight scroll effects.
        // Screens that do not pass scrollY behave like a normal ScrollView.
        onScroll={
          scrollY
            ? Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )
            : undefined
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <Animated.View
          style={[
            styles.inner,
            {
              opacity: enterProgress,
              transform: [{ translateY: enterTranslateY }]
            }
          ]}
        >
          {children}
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
    minHeight: 0
  },
  scroll: {
    flex: 1,
    minHeight: 0
  },
  content: {
    flexGrow: 1,
    padding: 22,
    paddingBottom: 36
  },
  inner: {
    alignSelf: "center",
    flex: 1,
    gap: 20,
    maxWidth: 430,
    width: "100%"
  }
});
