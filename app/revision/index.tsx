import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
    FadeInUp, 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withSequence
} from 'react-native-reanimated';
import { generateRevisionSheet } from '@/services/geminiService';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EXPLORE_TOPICS = [
    { name: 'Photosynthesis', icon: 'leaf', category: 'Biology', color: '#10B981', bg: '#D1FAE5' },
    { name: 'Quantum Physics', icon: 'atom', category: 'Physics', color: '#4F46E5', bg: '#E0E7FF' },
    { name: 'Calculus', icon: 'function', category: 'Maths', color: '#F97316', bg: '#FFEDD5' },
    { name: 'French Rev.', icon: 'pillar', category: 'History', color: '#E11D48', bg: '#FFE4E6' },
    { name: 'Org. Chemistry', icon: 'flask', category: 'Chemistry', color: '#8B5CF6', bg: '#EDE9FE' },
    { name: 'World War II', icon: 'shield', category: 'History', color: '#2563EB', bg: '#DBEAFE' },
];

const LEVELS = [
    { label: 'Summary', color: '#10B981' },
    { label: 'Normal', color: '#0F766E' },
    { label: 'Detailed', color: '#4F46E5' }
];

export default function RevisionInputScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
    
    const [topic, setTopic] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('Normal');
    const [isLoading, setIsLoading] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const buttonScale = useSharedValue(1);
    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }]
    }));

    const keyboardAnimatedStyle = useAnimatedStyle(() => ({
        paddingBottom: Math.max(insets.bottom || 24, Math.abs(keyboardHeight.value))
    }));

    const handleGenerate = async (selectedTopic?: string) => {
        const finalTopic = selectedTopic || topic;
        if (!finalTopic.trim()) return;

        buttonScale.value = withSequence(
            withSpring(0.95),
            withSpring(1)
        );

        setIsLoading(true);
        try {
            const data = await generateRevisionSheet(finalTopic, '', selectedLevel);
            router.push({
                pathname: '/revision/sheet',
                params: { data: JSON.stringify(data) }
            });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to generate revision sheet. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 60 : 40) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#0F766E" />
                </TouchableOpacity>
                <Text style={styles.headerLabel}>Revision Sheet</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
            >
                <Animated.View entering={FadeInUp.duration(400)} style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Study{"\n"}<Text style={styles.accentText}>Materials.</Text></Text>
                    <Text style={styles.heroSubtitle}>Instantly generate comprehensive, structured study materials for any topic.</Text>
                </Animated.View>

                {/* Input with Prism Depth */}
                <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.inputHost}>
                    <Text style={styles.sectionLabel}>Target Topic</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputPrismShadow} />
                        <View style={[styles.inputBox, isInputFocused && { borderColor: '#14B8A6', backgroundColor: '#F0FDFA' }]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter topic name..."
                                placeholderTextColor="#94A3B8"
                                value={topic}
                                onChangeText={setTopic}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                selectionColor="#0F766E"
                                autoCorrect={false}
                            />
                            {topic.length > 0 && (
                                <TouchableOpacity onPress={() => setTopic('')} style={styles.clearBtn}>
                                    <Ionicons name="close-circle" size={20} color="#CBD5E1" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(400).delay(150)} style={styles.section}>
                    <Text style={styles.sectionLabel}>Synthesis Depth</Text>
                    <View style={styles.levelContainer}>
                        {LEVELS.map((level) => {
                            const isActive = selectedLevel === level.label;
                            return (
                                <TouchableOpacity
                                    key={level.label}
                                    style={[
                                        styles.levelOption,
                                        isActive && { backgroundColor: level.color + '10', borderColor: level.color }
                                    ]}
                                    onPress={() => setSelectedLevel(level.label)}
                                >
                                    {isActive && (
                                        <Animated.View entering={FadeInUp.duration(200)} style={[styles.activeDot, { backgroundColor: level.color }]} />
                                    )}
                                    <Text style={[
                                        styles.levelText,
                                        isActive && { color: level.color, fontFamily: 'FKGrotesk-Bold' }
                                    ]}>{level.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Animated.View>

                {/* Multicolored Topic Grid for Personality */}
                <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>Explore Topics</Text>
                    </View>
                    <View style={styles.topicGrid}>
                        {EXPLORE_TOPICS.map((item, index) => (
                            <Animated.View key={index} entering={FadeInUp.duration(400).delay(250 + index * 50)}>
                                <TouchableOpacity 
                                    style={[styles.topicCard, { backgroundColor: item.bg, borderColor: item.color }]}
                                    onPress={() => handleGenerate(item.name)}
                                    activeOpacity={0.8}
                                >
                                    <MaterialCommunityIcons 
                                        name={item.icon as any} 
                                        size={64} 
                                        color={item.color} 
                                        style={styles.watermarkIcon} 
                                    />
                                    <View style={styles.topicCardInner}>
                                        <View style={styles.categoryBadge}>
                                            <Text style={[styles.categoryTag, { color: item.color }]}>{item.category}</Text>
                                        </View>
                                        <Text style={[styles.topicName, { color: '#0F172A' }]}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Fixed Footer with Dynamic Keyboard Adjustment */}
            <Animated.View style={[styles.footer, keyboardAnimatedStyle]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleGenerate()}
                    disabled={!topic.trim() || isLoading}
                >
                    <Animated.View style={[
                        styles.mainButtonContainer, 
                        (!topic.trim() || isLoading) && styles.mainButtonDisabled,
                        buttonAnimatedStyle
                    ]}>
                        <View style={styles.mainButtonShadow} />
                        <View style={styles.mainButton}>
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text style={styles.mainButtonText}>Create Revision Sheet</Text>
                                    <View style={styles.buttonIcon}>
                                        <MaterialCommunityIcons name="layers-triple" size={20} color="#0F766E" />
                                    </View>
                                </>
                            )}
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0FDFA',
    },
    headerLabel: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Bold',
        color: '#0F766E',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    heroSection: {
        marginBottom: 36,
    },
    heroTitle: {
        fontSize: 48,
        fontFamily: 'Tiempos-Headline',
        color: '#0F172A',
        lineHeight: 52,
    },
    accentText: {
        color: '#0F766E',
    },
    heroSubtitle: {
        fontSize: 16,
        fontFamily: 'FKGrotesk-Medium',
        color: '#64748B',
        lineHeight: 24,
        marginTop: 12,
    },
    inputHost: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 13,
        fontFamily: 'FKGrotesk-Bold',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    inputContainer: {
        position: 'relative',
    },
    inputPrismShadow: {
        position: 'absolute',
        top: 6,
        left: 6,
        right: -6,
        bottom: -6,
        backgroundColor: '#CCFBF1',
        borderRadius: 16,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderWidth: 2,
        borderColor: '#0F766E',
        zIndex: 2,
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontFamily: 'FKGrotesk-Bold',
        color: '#0F766E',
        padding: 0,
        margin: 0,
    },
    clearBtn: {
        paddingLeft: 10,
    },
    section: {
        marginBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    topicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 20,
    },
    topicCard: {
        width: (SCREEN_WIDTH - 60) / 2,
        height: 110,
        borderRadius: 20,
        borderWidth: 1.5,
        overflow: 'hidden',
        position: 'relative',
    },
    watermarkIcon: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        opacity: 0.15,
        transform: [{ rotate: '-15deg' }],
    },
    topicCardInner: {
        flex: 1,
        padding: 14,
        justifyContent: 'space-between',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryTag: {
        fontSize: 10,
        fontFamily: 'FKGrotesk-Bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    topicName: {
        fontSize: 15,
        fontFamily: 'FKGrotesk-Bold',
        color: '#0F172A',
        lineHeight: 20,
    },
    levelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    levelOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    levelText: {
        fontSize: 14,
        fontFamily: 'FKGrotesk-Medium',
        color: '#64748B',
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        zIndex: 5,
    },
    mainButtonContainer: {
        position: 'relative',
        height: 64,
        marginBottom: 10,
    },
    mainButtonShadow: {
        position: 'absolute',
        top: 6,
        left: 6,
        right: -6,
        bottom: -6,
        backgroundColor: '#115E59', 
        borderRadius: 16,
    },
    mainButton: {
        flex: 1,
        backgroundColor: '#0F766E',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#042F2E',
    },
    mainButtonDisabled: {
        opacity: 0.6,
    },
    mainButtonText: {
        fontSize: 18,
        fontFamily: 'FKGrotesk-Bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    buttonIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#CCFBF1',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
});
