import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import Animated, {
    FadeInDown,
    FadeInUp
} from 'react-native-reanimated';
import { getHistory } from '@/services/storageService';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

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

            {/* Header */}
            <AnimatedView entering={FadeInUp.delay(50).springify()} style={styles.header}>
                <View style={styles.logoRow}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="document-text-sharp" size={16} color="white" />
                    </View>
                    <Text style={styles.appName}>StudySnap</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="notifications-outline" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileBtn}>
                        <Ionicons name="person-circle-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </AnimatedView>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Greeting Section */}
                <AnimatedView entering={FadeInDown.delay(100).springify()} style={styles.greetingSection}>
                    <View style={styles.goodMorningRow}>
                        <FontAwesome name="star" size={14} color="#F59E0B" style={{ marginRight: 6 }} />
                        <Text style={styles.goodMorningText}>Good morning</Text>
                    </View>
                    <Text style={[styles.mainHeading, { fontFamily: 'PlusJakartaSans_700Bold' }]}>
                        Ready to <Text style={[styles.highlightText, { fontFamily: 'PlusJakartaSans_700Bold' }]}>study</Text>?
                    </Text>
                    <Text style={[styles.subHeading, { fontFamily: 'PlusJakartaSans_500Medium' }]}>Let's turn your notes into knowledge</Text>
                </AnimatedView>

                {/* Phase 8: Apple Precision UI */}
                <AnimatedView entering={FadeInDown.delay(200).springify()} style={styles.glassBentoContainer}>
                    {/* 1. Chat with AI - Apple Sleek */}
                    <TouchableOpacity
                        style={styles.modernCard}
                        onPress={() => router.push('/chat')}
                        activeOpacity={0.9}
                    >
                        <View style={styles.modernBackground} />
                        <View style={styles.modernOutline} />
                        <LinearGradient
                            colors={['transparent', 'rgba(59, 130, 246, 0.15)', 'transparent']}
                            style={styles.modernNeonBlow}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                        <View style={styles.modernCardContent}>
                            <View style={styles.modernIconContainer}>
                                <Ionicons name="sparkles" size={26} color="#3B82F6" />
                            </View>
                            <View style={styles.modernTextContainer}>
                                <Text style={styles.modernTitle}>Chat with AI</Text>
                                <Text style={styles.modernSubtitle}>Your intelligent study buddy</Text>
                            </View>
                            <View style={styles.appleArrow}>
                                <Ionicons name="chevron-forward" size={18} color="#3B82F6" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* 2. Middle Row: Scan & Revision - Apple Precision */}
                    <View style={styles.modernRow}>
                        <TouchableOpacity
                            style={styles.modernSmallTile}
                            onPress={() => router.push({ pathname: '/scan', params: { mode: 'camera' } })}
                            activeOpacity={0.8}
                        >
                            <View style={styles.modernBackground} />
                            <View style={styles.modernOutline} />
                            <LinearGradient
                                colors={['transparent', 'rgba(14, 165, 233, 0.15)', 'transparent']}
                                style={styles.modernNeonBlow}
                            />
                            <View style={[styles.modernSmallIconBox, { backgroundColor: 'rgba(14, 165, 233, 0.08)' }]}>
                                <Ionicons name="scan" size={26} color="#0EA5E9" />
                            </View>
                            <Text style={styles.modernSmallTitle}>Scan</Text>
                            <Text style={styles.modernSmallSubtitle}>Quick Solve</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.modernSmallTile}
                            onPress={() => router.push('/revision/new')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.modernBackground} />
                            <View style={styles.modernOutline} />
                            <LinearGradient
                                colors={['transparent', 'rgba(234, 179, 8, 0.15)', 'transparent']}
                                style={styles.modernNeonBlow}
                            />
                            <View style={[styles.modernSmallIconBox, { backgroundColor: 'rgba(234, 179, 8, 0.08)' }]}>
                                <Ionicons name="layers-outline" size={26} color="#CA8A04" />
                            </View>
                            <Text style={styles.modernSmallTitle}>Revision</Text>
                            <Text style={styles.modernSmallSubtitle}>AI Sheets</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 3. Bottom: Mock Test - Redesigned Weighted Layout */}
                    <TouchableOpacity
                        style={styles.appleMockCard}
                        onPress={() => router.push('/scan')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.modernBackground} />
                        <View style={styles.modernOutline} />
                        <LinearGradient
                            colors={['transparent', 'rgba(139, 92, 246, 0.22)', 'transparent']}
                            style={styles.modernNeonBlow}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                        <View style={styles.appleMockContent}>
                            <View style={styles.appleMockLeft}>
                                <View style={[styles.modernSmallIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.08)', marginBottom: 0, marginRight: 14 }]}>
                                    <Ionicons name="school" size={22} color="#8B5CF6" />
                                </View>
                                <View style={styles.appleMockTextGroup}>
                                    <Text style={styles.appleMockTitle}>Prepare Mock Test</Text>
                                    <Text style={styles.appleMockSubtitle}>Test your knowledge for the exams</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#8B5CF6" />
                        </View>
                    </TouchableOpacity>
                </AnimatedView>

                {/* Recent Scans */}
                <AnimatedView entering={FadeInDown.delay(500).springify()} style={styles.recentSection}>
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
        fontSize: 20,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.primary,
        letterSpacing: -0.8,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
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
    uploadCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 6,
    },
    uploadIconContainer: {
        marginRight: 12,
    },
    uploadGradient: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadTextContainer: {
        flex: 1,
    },
    uploadTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 1,
    },
    uploadSubtitle: {
        fontSize: 13,
        color: Colors.textLight,
    },
    lightningIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 4,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    statIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeSuccess: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#B7E4C7',
    },
    badgeText: {
        color: '#16A34A',
        fontSize: 12,
        fontWeight: '700',
    },
    statValue: {
        fontSize: 26,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 13,
        color: Colors.textLight,
        fontWeight: '500',
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
    glassBentoContainer: {
        marginBottom: 24,
    },
    modernCard: {
        width: '100%',
        height: 110,
        borderRadius: 28,
        marginBottom: 16,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    modernBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
    },
    modernOutline: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 28,
        borderWidth: 1.2,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    modernNeonBlow: {
        position: 'absolute',
        width: '200%',
        height: '200%',
        top: '-50%',
        left: '-50%',
        opacity: 0.5,
    },
    modernCardContent: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    modernIconContainer: {
        width: 54,
        height: 54,
        borderRadius: 20,
        backgroundColor: 'rgba(59, 130, 246, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    modernTextContainer: {
        flex: 1,
    },
    modernTitle: {
        fontSize: 19,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.text,
        letterSpacing: -0.5,
    },
    modernSubtitle: {
        fontSize: 14.5,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.textLight,
        marginTop: 3,
    },
    modernArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    appleArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modernRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    modernSmallTile: {
        width: '48%',
        height: 148,
        borderRadius: 28,
        padding: 20,
        overflow: 'hidden',
        justifyContent: 'flex-end',
    },
    modernSmallIconBox: {
        width: 48,
        height: 48,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    modernSmallTitle: {
        fontSize: 17,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.text,
        letterSpacing: -0.2,
    },
    modernSmallSubtitle: {
        fontSize: 13.5,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.textLight,
        marginTop: 2,
    },
    appleMockCard: {
        width: '100%',
        height: 84,
        borderRadius: 28,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    appleMockContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    appleMockLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    appleMockTitle: {
        fontSize: 17,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.text,
        letterSpacing: -0.2,
    },
    appleMockTextGroup: {
        justifyContent: 'center',
    },
    appleMockSubtitle: {
        fontSize: 13,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.textLight,
        marginTop: 1,
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
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.text,
        letterSpacing: -0.3,
    },
    seeAll: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    scanItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.2,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
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
        fontFamily: 'PlusJakartaSans_700Bold',
        color: Colors.text,
        marginBottom: 4,
        letterSpacing: -0.2,
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
        fontFamily: 'PlusJakartaSans_500Medium',
        color: Colors.textLight,
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
