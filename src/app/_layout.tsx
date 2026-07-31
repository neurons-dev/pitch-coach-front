import {
  NotoSansKR_600SemiBold,
  NotoSansKR_700Bold,
  NotoSansKR_900Black,
} from "@expo-google-fonts/noto-sans-kr";
import { Nunito_900Black } from "@expo-google-fonts/nunito";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "../hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Nunito_900Black,
    NotoSansKR_600SemiBold,
    NotoSansKR_700Bold,
    NotoSansKR_900Black,
  });

  // 폰트 로딩 실패 시에도 기본 폰트로 앱을 띄운다 (무한 흰 화면 방지)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="analysis" />
        <Stack.Screen name="result" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
