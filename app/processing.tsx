import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { generateStudyMaterial } from '@/services/geminiService';
import { saveResult } from '@/services/storageService';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    FadeIn,
    interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const STATUS_MESSAGES = [
    "Analyzing your notes...",
    "Extracting key concepts...",
    "Structuring explanation...",
    "Generating study highlights...",
    "Building your custom quiz...",
    "Finalizing study material..."
];

export default function ProcessingScreen() {
    const { uri } = useLocalSearchParams<{ uri: string }>();
    const router = useRouter();
    const [statusIndex, setStatusIndex] = useState(0);
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1
        );

        const statusTimer = setInterval(() => {
            setStatusIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
        }, 3000);

        if (uri) {
            processImage(decodeURIComponent(uri));
        }

        return () => clearInterval(statusTimer);
    }, [uri]);

    const processImage = async (imageUri: string) => {
        try {
            const result = await generateStudyMaterial(imageUri);
            const id = Date.now().toString();
            const savedItem = { id, imageUri, date: new Date().toISOString(), ...result };
            await saveResult(savedItem);

            // Small extra delay for smooth transition
            setTimeout(() => {
                router.replace(`/results/${id}`);
            }, 1000);
        } catch (error) {
            console.error(error);
            router.back();
        }
    };

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: interpolate(pulse.value, [1, 1.2], [1, 0.6]),
    }));

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#EFF6FF']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.centerContent}>
                <View style={styles.animationContainer}>
                    <Animated.View style={[styles.pulseCircle, pulseStyle]} />
                    <LinearGradient
                        colors={['#2563EB', '#3B82F6']}
                        style={styles.logoBadge}
                    >
                        <Ionicons name="sparkles" size={40} color="white" />
                    </LinearGradient>
                </View>

                <Animated.View entering={FadeIn.duration(800)} style={styles.textContainer}>
                    <Text style={styles.statusText}>{STATUS_MESSAGES[statusIndex]}</Text>
                    <Text style={styles.subtitle}>Our AI is working its magic</Text>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <View style={styles.progressBar}>
                    <Animated.View
                        entering={FadeIn.delay(500)}
                        style={[styles.progressIndicator, { width: `${(statusIndex + 1) * 16.6}%` }]}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    animationContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    pulseCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#3B82F6',
    },
    logoBadge: {
        width: 100,
        height: 100,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadow,
    },
    textContainer: {
        alignItems: 'center',
    },
    statusText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 100,
        width: '100%',
        paddingHorizontal: 40,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressIndicator: {
        height: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 3,
    },
});
