import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { getHistory } from '@/services/storageService';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ResultScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const history = await getHistory();
            const item = history.find((h: any) => h.id === id);
            if (item) {
                setData(item);
            }
        } catch (e) {
            console.error('Error loading data:', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <LinearGradient colors={['#F8FAFC', '#EFF6FF']} style={StyleSheet.absoluteFill} />
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading your study notes...</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={styles.errorText}>Result not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background Gradients */}
            <LinearGradient
                colors={['#EFF6FF', '#F8FAFC']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Decorative Orbs */}
            <View style={styles.orb1} />
            <View style={styles.orb2} />

            {/* Transparent Header */}
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => router.back()} 
                    style={styles.headerBtn}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Study Material</Text>
                <View style={[styles.headerBtn, { opacity: 0 }]} /> 
            </View>

            <ScrollView 
                style={styles.content} 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Scanned Image with Glassmorphism Overlays */}
                {data.imageUri && (
                    <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.imageContainer}>
                        <Image source={{ uri: data.imageUri }} style={styles.scannedImage} blurRadius={0} />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                            style={styles.imageOverlay}
                        />
                        <View style={styles.imageBadge}>
                            <Ionicons name="scan-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
                            <Text style={styles.imageBadgeText}>Original Scan</Text>
                        </View>
                        <View style={styles.imageDateBox}>
                            <Text style={styles.imageDateText}>{new Date(data.date).toLocaleDateString()}</Text>
                        </View>
                    </Animated.View>
                )}

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.sectionHeader}>
                    <Text style={styles.sectionHeading}>Deep Dive Tools</Text>
                    <Text style={styles.sectionSubheading}>Explore your material interactively</Text>
                </Animated.View>

                {/* 4 Distinct Action Grid Options */}
                <View style={styles.grid}>
                    {/* Explain the Solution */}
                    <AnimatedTouchableOpacity 
                        entering={FadeInDown.delay(300).springify()} 
                        style={styles.gridItem}
                        onPress={() => router.push(`/results/explanation/${id}`)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            style={styles.cardInternal}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                                <Ionicons name="chatbubbles" size={26} color="#4F46E5" />
                            </View>
                            <Text style={styles.itemTitle}>Explain Solution</Text>
                            <Text style={styles.itemSubtitle}>Interactive AI Tutor</Text>
                        </LinearGradient>
                    </AnimatedTouchableOpacity>

                    {/* Create Revision Sheet */}
                    <AnimatedTouchableOpacity 
                        entering={FadeInDown.delay(400).springify()} 
                        style={styles.gridItem}
                        onPress={() => router.push(`/results/revision/${id}`)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            style={styles.cardInternal}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                                <Ionicons name="layers" size={26} color="#059669" />
                            </View>
                            <Text style={styles.itemTitle}>Revision Sheet</Text>
                            <Text style={styles.itemSubtitle}>{data.summary?.length || 0} Key Points</Text>
                        </LinearGradient>
                    </AnimatedTouchableOpacity>

                    {/* Quick Summary */}
                    <AnimatedTouchableOpacity 
                        entering={FadeInDown.delay(500).springify()} 
                        style={styles.gridItem}
                        onPress={() => router.push(`/results/summary/${id}`)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            style={styles.cardInternal}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
                                <FontAwesome5 name="bolt" size={24} color="#D97706" />
                            </View>
                            <Text style={styles.itemTitle}>Quick Summary</Text>
                            <Text style={styles.itemSubtitle}>High-level overview</Text>
                        </LinearGradient>
                    </AnimatedTouchableOpacity>

                    {/* Practice Quiz */}
                    <AnimatedTouchableOpacity 
                        entering={FadeInDown.delay(600).springify()} 
                        style={styles.gridItem}
                        onPress={() => router.push(`/results/quiz/${id}`)}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#ffffff', '#ffffff']}
                            style={styles.cardInternal}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                                <Ionicons name="game-controller" size={26} color="#DC2626" />
                            </View>
                            <Text style={styles.itemTitle}>Practice Quiz</Text>
                            <Text style={styles.itemSubtitle}>{data.quiz?.length || 0} Questions</Text>
                        </LinearGradient>
                    </AnimatedTouchableOpacity>

                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    orb1: {
        position: 'absolute',
        top: -100,
        right: -50,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#3B82F6',
        opacity: 0.08,
    },
    orb2: {
        position: 'absolute',
        top: 200,
        left: -100,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#8B5CF6',
        opacity: 0.05,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748B',
        fontWeight: '600',
    },
    errorText: {
        fontSize: 18,
        color: Colors.text,
        textAlign: 'center',
        marginTop: 100,
        fontWeight: '700',
    },
    backButton: {
        marginTop: 20,
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: Colors.primary,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: "transparent",
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadow,
        shadowOpacity: 0.05,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
        letterSpacing: -0.5,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    imageContainer: {
        width: '100%',
        height: 220,
        borderRadius: 28,
        marginBottom: 32,
        overflow: 'hidden',
        ...Colors.shadow,
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
        backgroundColor: '#E2E8F0',
    },
    scannedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: 20,
    },
    imageBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backdropFilter: 'blur(10px)', // Note: backdrop filter works on web, using semi-transparent for mobile
    },
    imageBadgeText: {
        fontWeight: '700',
        fontSize: 12,
        color: '#FFF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    imageDateBox: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    imageDateText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.9,
    },
    sectionHeader: {
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    sectionHeading: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 4,
    },
    sectionSubheading: {
        fontSize: 15,
        color: Colors.textLight,
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16, // using gap for React Native 0.71+
    },
    gridItem: {
        width: (width - 40 - 16) / 2, // 2 items per row with 16 spacing
        marginBottom: 0, 
    },
    cardInternal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 20,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadow,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.8)',
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    itemTitle: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 4,
    },
    itemSubtitle: {
        color: Colors.textLight,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});
