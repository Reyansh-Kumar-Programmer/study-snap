import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { KeyboardProvider } from 'react-native-keyboard-controller';

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
    'FKGrotesk-Light': require('../assets/fonts/FKGroteskNeueTrial-Light-BF6576818c0f3e8.otf'),
    'FKGrotesk-Medium': require('../assets/fonts/FKGroteskNeueTrial-Medium-BF6576818c3a00a.otf'),
    'FKGrotesk-Regular': require('../assets/fonts/FKGroteskNeueTrial-Regular-BF6576818c3af74.otf'),
    'Tiempos-Headline': require('../assets/fonts/TestTiemposHeadlineVF-Roman.ttf'),
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
    <KeyboardProvider>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="results/[id]" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="processing" options={{ headerShown: false, presentation: 'transparentModal' }} />
        <Stack.Screen name="revision/index" options={{ headerShown: false }} />
        <Stack.Screen name="revision/sheet" options={{ headerShown: false }} />
      </Stack>
    </KeyboardProvider>
  );
}
