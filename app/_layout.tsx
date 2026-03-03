import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_300Light,
  Outfit_200ExtraLight
} from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_300Light,
    Outfit_200ExtraLight,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    'Tiempos-Bold': require('../assets/fonts/Test Tiempos Fine/TestTiemposFine-Bold.otf'),
    'Tiempos-Medium': require('../assets/fonts/Test Tiempos Fine/TestTiemposFine-Medium.otf'),
    'FK-Grotesk-Regular': require('../assets/fonts/FK-Grotesk-Font-Family/FKGroteskTrial-Regular.otf'),
    'FK-Grotesk-Bold': require('../assets/fonts/FK-Grotesk-Font-Family/FKGroteskTrial-Bold.otf'),
    'FK-Grotesk-Italic': require('../assets/fonts/FK-Grotesk-Font-Family/FKGroteskTrial-Italic.otf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen name="results/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="processing" options={{ headerShown: false, presentation: 'transparentModal' }} />
    </Stack>
  );
}
