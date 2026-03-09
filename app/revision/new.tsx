import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withTiming, interpolateColor, useSharedValue, withSpring, interpolate } from 'react-native-reanimated';
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Wrapper for interactive scale on press
const ScaleOnPress = ({ children, onPress, style, disabled }: any) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(scale.value, { damping: 15, stiffness: 200 }) }]
    }));
    return (
        <AnimatedTouchableOpacity
            onPressIn={() => { if (!disabled) scale.value = 0.96; }}
            onPressOut={() => { if (!disabled) scale.value = 1; }}
            onPress={onPress}
            style={[style, animatedStyle]}
            activeOpacity={0.8}
            disabled={disabled}
        >
            {children}
        </AnimatedTouchableOpacity>
    );
};

export default function NewRevisionScreen() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const isActive = useSharedValue(0);

    useEffect(() => {
        isActive.value = withTiming(topic.trim().length > 0 ? 1 : 0, { duration: 300 });
    }, [topic]);

    const animatedButtonStyle = useAnimatedStyle(() => {
        const borderColor = interpolateColor(
            isActive.value,
            [0, 1],
            ['#E2E8F0', '#1E6FE3']
        );
        const backgroundColor = interpolateColor(
            isActive.value,
            [0, 1],
            ['transparent', 'rgba(30, 111, 227, 0.02)']
        );

        return {
            borderColor,
            backgroundColor,
            transform: [{ scale: interpolate(isActive.value, [0, 1], [0.98, 1]) }],
            opacity: interpolate(isActive.value, [0, 1], [0.8, 1]),
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            isActive.value,
            [0, 1],
            ['#94A3B8', '#0F766E'] // Dark Teal output
        );
        return { color };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            isActive.value,
            [0, 1],
            ['#94A3B8', '#FFFFFF'] // White icon for the new button
        );
        return { color };
    });

    // Dark Neon/Glow Button Style (Shadow Removed)
    const animatedGlowBtnStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: interpolate(isActive.value, [0, 1], [0.95, 1]) }],
            opacity: interpolate(isActive.value, [0, 1], [0.6, 1])
        };
    });

    const animatedBtnTextStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            isActive.value,
            [0, 1],
            ['#94A3B8', '#FFFFFF'] // Text turns white on the stark background
        );
        return { color };
    });

    const handleGenerate = () => {
        if (!topic.trim()) return;
        // Simulate generation and navigate to results (using mock ID for now)
        router.push(`/results/revision/mock?topic=${encodeURIComponent(topic)}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Solid Minimalist Background */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#F8FAFC' }]} />

            {/* Editorial Header - Tiempos only here */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Revision</Text>
                <View style={{ width: 44 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Massive Editorial Prompt */}
                    <Animated.View entering={FadeInDown.duration(800).springify()}>
                        <Text style={styles.editorialLabel}>Create New</Text>
                        <Text style={styles.mainPrompt}>What are we mastering today?</Text>
                    </Animated.View>

                    {/* Massive Borderless Input */}
                    <Animated.View entering={FadeInDown.delay(200).duration(800).springify()} style={styles.inputSegment}>
                        <TextInput
                            style={styles.editorialInput}
                            placeholder="Enter your topic..."
                            placeholderTextColor="#CBD5E1"
                            value={topic}
                            onChangeText={setTopic}
                            multiline
                            autoFocus
                        />
                    </Animated.View>

                    {/* Wide Editorial Upload Module - Tinted Capsule */}
                    <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} style={styles.uploadSegment}>
                        <ScaleOnPress style={styles.uploadCapsule}>
                            <View style={styles.uploadIconBox}>
                                <Ionicons name="document-text" size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.uploadInfo}>
                                <Text style={styles.uploadRowTitle}>Enrich with reference material</Text>
                                <Text style={styles.uploadRowSubtitle}>Upload PDF or text for better accuracy</Text>
                            </View>
                            <View style={styles.addIconBox}>
                                <Ionicons name="add" size={24} color="#3B82F6" />
                            </View>
                        </ScaleOnPress>
                    </Animated.View>

                    {/* Suggested Topics - Fill the screen */}
                    <Animated.View entering={FadeInDown.delay(600).duration(800).springify()} style={styles.suggestionsSection}>
                        <Text style={styles.editorialLabel}>Quick Start</Text>
                        <View style={styles.suggestionsGrid}>
                            {['Quantum Physics', 'Global History', 'Neuroscience', 'Web Design'].map((item, idx) => (
                                <ScaleOnPress
                                    key={idx}
                                    style={styles.suggestionTag}
                                    onPress={() => setTopic(item)}
                                >
                                    <Text style={styles.suggestionText}>{item}</Text>
                                </ScaleOnPress>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Integrated Generate Button */}
                    <View style={styles.actionSection}>
                        <ScaleOnPress
                            onPress={handleGenerate}
                            disabled={!topic.trim()}
                        >
                            <Animated.View style={[styles.glowBtnWrapper, animatedGlowBtnStyle]}>
                                {topic.trim() ? (
                                    <LinearGradient
                                        colors={['#0F172A', '#1E293B']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.generateBtnBackground}
                                    >
                                        <Animated.Text style={[styles.generateBtnText, animatedBtnTextStyle]}>
                                            Generate Revision Sheet
                                        </Animated.Text>
                                        <AnimatedIcon name="sparkles" size={18} style={[{ marginLeft: 8 }, animatedIconStyle]} />
                                    </LinearGradient>
                                ) : (
                                    <View style={[styles.generateBtnBackground, { backgroundColor: '#F1F5F9', borderWidth: 1.5, borderColor: '#E2E8F0' }]}>
                                        <Animated.Text style={[styles.generateBtnText, animatedBtnTextStyle]}>
                                            Generate Revision Sheet
                                        </Animated.Text>
                                        <AnimatedIcon name="sparkles" size={18} style={[{ marginLeft: 8 }, animatedIconStyle]} />
                                    </View>
                                )}
                            </Animated.View>
                        </ScaleOnPress>
                        <Text style={styles.actionHint}>AI will synthesize a full sheet based on your topic.</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    screenTitle: {
        fontFamily: 'Tiempos-Bold',
        fontSize: 18,
        color: '#0F172A',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    editorialLabel: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 12,
        color: '#3B82F6',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    mainPrompt: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 36,
        color: '#0F172A',
        lineHeight: 40,
        letterSpacing: -1,
    },
    inputSegment: {
        marginTop: 40,
        marginBottom: 40,
    },
    editorialInput: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 42,
        color: '#0F172A',
        lineHeight: 48,
        letterSpacing: -1.5,
    },
    uploadSegment: {
        marginBottom: 40,
    },
    uploadCapsule: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F1F7FF',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#DCEBFF',
    },
    uploadIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    uploadInfo: {
        flex: 1,
    },
    uploadRowTitle: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 15,
        color: '#0F172A',
        marginBottom: 2,
    },
    uploadRowSubtitle: {
        fontFamily: 'FK-Grotesk-Medium',
        fontSize: 12,
        color: '#64748B',
    },
    addIconBox: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    suggestionsSection: {
        marginBottom: 60,
    },
    suggestionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
    },
    suggestionTag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    suggestionText: {
        fontFamily: 'FK-Grotesk-Bold',
        fontSize: 13,
        color: '#0F172A',
    },
    actionSection: {
        marginTop: 'auto',
        paddingBottom: 20,
    },
    actionHint: {
        fontFamily: 'FK-Grotesk-Medium',
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 18,
    },
    glowBtnWrapper: {
        borderRadius: 32,
    },
    generateBtnBackground: {
        height: 64,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    generateBtnText: {
        fontSize: 16,
        fontFamily: 'FK-Grotesk-Bold',
        letterSpacing: 0.5,
    },
});
