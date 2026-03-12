import Colors from '@/constants/Colors';
import { getHistory } from '@/services/storageService';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
    const router = useRouter();
    const [history, setHistory] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const loadHistory = async () => {
        try {
            const data = await getHistory();
            setHistory(data.slice(0, 5)); // Only show last 5 on home
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    return (
        <View style={styles.container}>
            {/* Subtle Decorative Background Blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <View style={styles.logoIcon}>
                        <FontAwesome name="file-text" size={16} color="white" />
                    </View>
                    <Text style={styles.appName}>StudySnap</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <FontAwesome name="bell-o" size={18} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileBtn}>
                        <FontAwesome name="user" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Greeting Section */}
                <AnimatedView entering={FadeInDown.delay(100).springify()} style={styles.greetingSection}>
                    <View style={styles.goodMorningRow}>
                        <FontAwesome name="star" size={14} color="#F59E0B" style={{ marginRight: 6 }} />
                        <Text style={styles.goodMorningText}>Good morning</Text>
                    </View>
                    <Text style={styles.mainHeading}>
                        Ready to <Text style={styles.highlightText}>study</Text>?
                    </Text>
                    <Text style={styles.subHeading}>Let's turn your notes into knowledge</Text>
                </AnimatedView>

                {/* Bento Grid */}
                <View style={styles.bentoGrid}>
                    <View style={styles.bentoRow}>

                        <AnimatedView entering={FadeInDown.delay(200).springify()} style={[styles.premiumBentoItemLight, styles.bentoLarge, styles.glowIndigoLight]}>
                            <TouchableOpacity
                                style={styles.bentoCardInner}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.6)']}
                                    style={styles.premiumGradient}
                                >
                                    <View style={[styles.premiumAbstractGlowLight, { backgroundColor: '#4F46E5', top: -40, right: -30, width: 140, height: 140, borderRadius: 70 }]} />
                                    <LinearGradient
                                        colors={['rgba(79, 70, 229, 0.15)', 'rgba(79, 70, 229, 0.05)']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                        style={[styles.iconWrapperPremiumLight, { borderColor: 'rgba(79, 70, 229, 0.3)' }]}
                                    >
                                        <Ionicons name="chatbubble-ellipses" size={28} color="#4F46E5" />
                                    </LinearGradient>
                                    <View style={styles.bentoTextContainer}>
                                        <Text style={styles.premiumTitleLight}>Chat with AI</Text>
                                        <Text style={styles.premiumSubtitleLight}>Ask anything about your notes</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </AnimatedView>
                    </View>

                    <View style={styles.bentoRow}>

                        <AnimatedView entering={FadeInDown.delay(300).springify()} style={[styles.premiumBentoItemLight, styles.bentoSmall, styles.glowSkyLight]}>
                            <TouchableOpacity
                                style={styles.bentoCardInner}
                                onPress={() => router.push('/scan')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.6)']} style={styles.premiumGradientSmall}>
                                    <View style={[styles.premiumAbstractGlowLight, { backgroundColor: '#0EA5E9', bottom: -20, right: -20, width: 100, height: 100, borderRadius: 50 }]} />
                                    <LinearGradient
                                        colors={['rgba(14, 165, 233, 0.15)', 'rgba(14, 165, 233, 0.05)']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                        style={[styles.iconWrapperPremiumSmallLight, { borderColor: 'rgba(14, 165, 233, 0.3)' }]}
                                    >
                                        <Ionicons name="scan" size={24} color="#0EA5E9" />
                                    </LinearGradient>
                                    <Text style={styles.premiumTitleSmallLight}>Scan your{"\n"}Question</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </AnimatedView>


                        <AnimatedView entering={FadeInDown.delay(350).springify()} style={[styles.premiumBentoItemLight, styles.bentoSmall, styles.glowPurpleLight]}>
                            <TouchableOpacity
                                style={styles.bentoCardInner}
                                activeOpacity={0.8}
                            >
                                <LinearGradient colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.6)']} style={styles.premiumGradientSmall}>
                                    <View style={[styles.premiumAbstractGlowLight, { backgroundColor: '#8B5CF6', bottom: -20, right: -20, width: 100, height: 100, borderRadius: 50 }]} />
                                    <LinearGradient
                                        colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                        style={[styles.iconWrapperPremiumSmallLight, { borderColor: 'rgba(139, 92, 246, 0.3)' }]}
                                    >
                                        <Ionicons name="newspaper" size={24} color="#8B5CF6" />
                                    </LinearGradient>
                                    <Text style={styles.premiumTitleSmallLight}>Revision{"\n"}Sheet</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </AnimatedView>
                    </View>

                    <View style={styles.bentoRow}>

                        <AnimatedView entering={FadeInDown.delay(400).springify()} style={[styles.premiumBentoItemLight, styles.bentoFull, styles.glowPinkLight]}>
                            <TouchableOpacity
                                style={styles.bentoCardInner}
                                activeOpacity={0.8}
                            >
                                <LinearGradient colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.6)']} style={styles.premiumRowContent}>
                                    <View style={[styles.premiumAbstractGlowLight, { backgroundColor: '#F472B6', top: -30, right: 10, width: 140, height: 140, borderRadius: 70 }]} />
                                    <LinearGradient
                                        colors={['rgba(244, 114, 182, 0.15)', 'rgba(244, 114, 182, 0.05)']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                        style={[styles.iconWrapperPremiumLight, { borderColor: 'rgba(244, 114, 182, 0.3)', margin: 0, marginRight: 16, marginBottom: 0 }]}
                                    >
                                        <Ionicons name="clipboard" size={28} color="#F472B6" />
                                    </LinearGradient>
                                    <View style={{ flex: 1, zIndex: 10 }}>
                                        <Text style={styles.premiumTitleFullRowLight}>Generate Mock Test</Text>
                                        <Text style={styles.premiumSubtitleLight}>Test your knowledge with AI</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={22} color="#0F172A" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </AnimatedView>
                    </View>
                </View>

                {/* Weekly Progress */}
                <AnimatedView entering={FadeInDown.delay(500).springify()} style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <View>
                            <Text style={styles.progressTitle}>Weekly Progress</Text>
                            <Text style={styles.progressSubtitle}>80% of your goal</Text>
                        </View>
                        <View style={styles.badgeSuccessLight}>
                            <Ionicons name="trending-up" size={14} color="#16A34A" style={{ marginRight: 4 }} />
                            <Text style={styles.badgeTextGreen}>+15%</Text>
                        </View>
                    </View>

                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            style={[styles.progressBarFill, { width: '80%' }]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                    </View>

                    <View style={styles.progressFooter}>
                        <View style={styles.progressStat}>
                            <Ionicons name="time" size={14} color={Colors.textLight} style={{ marginRight: 4 }} />
                            <Text style={styles.footerText}>4 days left</Text>
                        </View>
                        <Text style={styles.footerTextBold}>{history.length}/15 scans</Text>
                    </View>
                </AnimatedView>

                {/* Recent Scans */}
                <AnimatedView entering={FadeInDown.delay(600).springify()} style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Scans</Text>
                        <TouchableOpacity onPress={() => router.push('/profile')}>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {history.length > 0 ? (
                        history.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.scanItem}
                                activeOpacity={0.6}
                                onPress={() => router.push(`/results/${item.id}`)}
                            >
                                <View style={[styles.scanIconBox, { backgroundColor: '#DBEAFE' }]}>
                                    <Ionicons name="document-text" size={22} color={Colors.primary} />
                                </View>
                                <View style={styles.scanInfo}>
                                    <Text style={styles.scanTitle} numberOfLines={1}>{item.explanation.slice(0, 30)}...</Text>
                                    <View style={styles.scanMeta}>
                                        <View style={[styles.tag, { backgroundColor: '#DCFCE7' }]}>
                                            <Text style={[styles.tagText, { color: '#16A34A' }]}>Study Aid</Text>
                                        </View>
                                        <Text style={styles.dot}>•</Text>
                                        <Text style={styles.scanTime}>
                                            <Ionicons name="time-outline" size={12} /> {new Date(item.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.arrowBtn}>
                                    <Ionicons name="chevron-forward" size={14} color={Colors.textLight} />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="cloud-upload-outline" size={48} color="#E2E8F0" />
                            <Text style={styles.emptyText}>No scans yet. Try scanning your notes!</Text>
                        </View>
                    )}

                </AnimatedView>

                {/* Space for FAB */}
                <View style={{ height: 100 }} />
            </ScrollView>


            {/* Static Floating Scan Button */}
            <AnimatedView
                entering={FadeInUp.delay(600).springify()}
                style={styles.fabContainer}
            >
                <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => router.push('/scan')}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        style={styles.scanGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name="camera" size={20} color="white" style={{ marginRight: 10 }} />
                        <Text style={styles.scanNotesText}>Scan Notes</Text>
                        <Ionicons name="sparkles" size={16} color="white" style={{ marginLeft: 10 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </AnimatedView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute',
        top: -40,
        right: -40,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#3B82F605',
        zIndex: -1,
    },
    blob2: {
        position: 'absolute',
        bottom: 120,
        left: -60,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: '#8B5CF603',
        zIndex: -1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        zIndex: 10,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        width: 28,
        height: 28,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    appName: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
        letterSpacing: -0.5,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    greetingSection: {
        marginBottom: 24,
    },
    goodMorningRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    goodMorningText: {
        fontSize: 13,
        color: Colors.textLight,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    mainHeading: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
        letterSpacing: -1,
    },
    highlightText: {
        color: Colors.primary,
    },
    subHeading: {
        fontSize: 15,
        color: Colors.textLight,
        fontWeight: '400',
    },
    bentoGrid: {
        marginBottom: 24,
        gap: 12,
    },
    bentoRow: {
        flexDirection: 'row',
        gap: 12,
    },
    premiumBentoItemLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight opacity to enable glass effect
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1, // User requested 1px
        borderColor: '#E2E8F0', // Light greyish border requested for bento items
    },
    glowIndigoLight: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
    glowSkyLight: {
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
    glowPurpleLight: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
    glowPinkLight: {
        shadowColor: '#F472B6',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
    },
    bentoLarge: {
        flex: 1,
        height: 160,
    },
    bentoSmall: {
        flex: 1,
        height: 140, // Keeps the increased height request
    },
    bentoFull: {
        flex: 1,
        height: 90,
    },
    bentoCardInner: {
        flex: 1,
    },
    premiumGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    premiumGradientSmall: {
        flex: 1,
        padding: 18,
        justifyContent: 'center',
    },
    premiumRowContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconWrapperPremiumLight: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        borderWidth: 1,
    },
    iconWrapperPremiumSmallLight: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1,
    },
    bentoTextContainer: {
        flex: 1,
        zIndex: 10,
    },
    premiumTitleLight: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A', // Dark Slate for crisp contrast on light background
        letterSpacing: -0.5,
    },
    premiumTitleSmallLight: {
        fontSize: 16,
        fontWeight: '400', // Regular as requested previously
        color: '#334155', // Rich grey
        lineHeight: 22,
        zIndex: 10,
    },
    premiumTitleFullRowLight: {
        fontSize: 17,
        fontWeight: '500', // Medium as requested previously
        color: '#0F172A',
        marginBottom: 2,
    },
    premiumSubtitleLight: {
        fontSize: 14,
        color: '#64748B', // Soft grey
        fontWeight: '400',
        marginTop: 2,
        zIndex: 10,
    },
    premiumAbstractGlowLight: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        zIndex: 0,
        filter: 'blur(45px)', // Increased blur for pure "ambient glow"
        opacity: 0.15, // Extremely subtle so it acts as lighting instead of a background blob
    },
    progressCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 2,
    },
    badgeSuccessLight: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B7E4C7',
    },
    badgeTextGreen: {
        color: '#16A34A',
        fontSize: 12,
        fontWeight: '700',
    },
    progressSubtitle: {
        fontSize: 14,
        color: Colors.textLight,
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 5,
        marginBottom: 14,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressStat: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: Colors.textLight,
        fontWeight: '500',
    },
    footerTextBold: {
        fontSize: 13,
        color: Colors.text,
        fontWeight: '700',
    },
    recentSection: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    seeAll: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    scanItem: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 14,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    scanIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    scanInfo: {
        flex: 1,
    },
    scanTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    scanMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: 8,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '700',
    },
    dot: {
        fontSize: 12,
        color: '#CBD5E1',
        marginRight: 8,
    },
    scanTime: {
        fontSize: 12,
        color: Colors.textLight,
        fontWeight: '500',
    },
    arrowBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
    },
    scanButton: {
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        borderRadius: 30,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    scanGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 30,
    },
    scanNotesText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
        textAlign: 'center',
    },
});
