import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay,
  withSpring,
  FadeIn,
  Easing
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

export default function SplashScreenComponent() {
  const router = useRouter();
  
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(20);

  useEffect(() => {
    // Sequence the animation
    logoScale.value = withSpring(1, { damping: 12 });
    logoOpacity.value = withTiming(1, { duration: 800 });
    
    textOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    textY.value = withDelay(600, withSpring(0));

    // Navigate to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }]
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }]
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <LinearGradient
            colors={['#7C3AED', '#C084FC']}
            style={styles.logoGradient}
          >
            <Ionicons name="school" size={48} color="#FFF" />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.brandName}>TutorXpert</Text>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Elevate your potential</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 32,
    fontFamily: 'FKGrotesk-Medium',
    color: '#0F172A',
    letterSpacing: -1,
  },
  divider: {
    width: 24,
    height: 3,
    backgroundColor: '#7C3AED',
    borderRadius: 2,
    marginVertical: 12,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'FKGrotesk-Regular',
    color: '#64748B',
    letterSpacing: 0.5,
  },
});
