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

const { width } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
    const router = useRouter();

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

                {/* Upload Card */}
                <AnimatedView entering={FadeInDown.delay(200).springify()}>
                    <TouchableOpacity
                        style={styles.uploadCard}
                        onPress={() => router.push({ pathname: '/scan', params: { mode: 'gallery' } })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.uploadIconContainer}>
                            <LinearGradient
                                colors={['#D946EF', '#8B5CF6']}
                                style={styles.uploadGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Ionicons name="image" size={22} color="white" />
                            </LinearGradient>
                        </View>
                        <View style={styles.uploadTextContainer}>
                            <Text style={styles.uploadTitle}>Upload from Gallery</Text>
                            <Text style={styles.uploadSubtitle}>Select existing photos</Text>
                        </View>
                        <View style={styles.lightningIcon}>
                            <Ionicons name="flash" size={14} color={Colors.primary} />
                        </View>
                    </TouchableOpacity>
                </AnimatedView>

                {/* Stats Row */}
                <AnimatedView entering={FadeInDown.delay(300).springify()} style={styles.statsRow}>
                    {/* Streak Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIcon, { backgroundColor: '#F59E0B' }]}>
                                <FontAwesome name="fire" size={16} color="white" />
                            </View>
                            <View style={styles.badgeSuccess}>
                                <Text style={styles.badgeText}>+2</Text>
                            </View>
                        </View>
                        <Text style={styles.statValue}>7</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>

                    {/* Scans Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIcon, { backgroundColor: Colors.primary }]}>
                                <FontAwesome name="trophy" size={16} color="white" />
                            </View>
                        </View>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Scans this week</Text>
                    </View>
                </AnimatedView>

                {/* Weekly Progress */}
                <AnimatedView entering={FadeInDown.delay(400).springify()} style={styles.progressCard}>
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
                        <Text style={styles.footerTextBold}>12/15 scans</Text>
                    </View>
                </AnimatedView>

                {/* Recent Scans */}
                <AnimatedView entering={FadeInDown.delay(500).springify()} style={styles.recentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Scans</Text>
                        <TouchableOpacity onPress={() => router.push('/profile')}>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Scan Item 1 */}
                    <TouchableOpacity style={styles.scanItem} activeOpacity={0.6}>
                        <View style={[styles.scanIconBox, { backgroundColor: '#DCFCE7' }]}>
                            <Ionicons name="book" size={22} color="#16A34A" />
                        </View>
                        <View style={styles.scanInfo}>
                            <Text style={styles.scanTitle}>Biology Chapter 5</Text>
                            <View style={styles.scanMeta}>
                                <View style={[styles.tag, { backgroundColor: '#DCFCE7' }]}>
                                    <Text style={[styles.tagText, { color: '#16A34A' }]}>Biology</Text>
                                </View>
                                <Text style={styles.dot}>•</Text>
                                <Text style={styles.scanTime}><Ionicons name="time-outline" size={12} /> 2 hours ago</Text>
                            </View>
                        </View>
                        <View style={styles.arrowBtn}>
                            <Ionicons name="chevron-forward" size={14} color={Colors.textLight} />
                        </View>
                    </TouchableOpacity>

                    {/* Scan Item 2 */}
                    <TouchableOpacity style={styles.scanItem} activeOpacity={0.6}>
                        <View style={[styles.scanIconBox, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="book" size={22} color="#D97706" />
                        </View>
                        <View style={styles.scanInfo}>
                            <Text style={styles.scanTitle}>History Notes - WWII</Text>
                            <View style={styles.scanMeta}>
                                <View style={[styles.tag, { backgroundColor: '#FEF3C7' }]}>
                                    <Text style={[styles.tagText, { color: '#D97706' }]}>History</Text>
                                </View>
                                <Text style={styles.dot}>•</Text>
                                <Text style={styles.scanTime}><Ionicons name="time-outline" size={12} /> Yesterday</Text>
                            </View>
                        </View>
                        <View style={styles.arrowBtn}>
                            <Ionicons name="chevron-forward" size={14} color={Colors.textLight} />
                        </View>
                    </TouchableOpacity>

                    {/* Scan Item 3 */}
                    <TouchableOpacity style={styles.scanItem} activeOpacity={0.6}>
                        <View style={[styles.scanIconBox, { backgroundColor: '#DBEAFE' }]}>
                            <Ionicons name="book" size={22} color="#2563EB" />
                        </View>
                        <View style={styles.scanInfo}>
                            <Text style={styles.scanTitle}>Math Formulas</Text>
                            <View style={styles.scanMeta}>
                                <View style={[styles.tag, { backgroundColor: '#DBEAFE' }]}>
                                    <Text style={[styles.tagText, { color: '#2563EB' }]}>Mathematics</Text>
                                </View>
                                <Text style={styles.dot}>•</Text>
                                <Text style={styles.scanTime}><Ionicons name="time-outline" size={12} /> 2 days ago</Text>
                            </View>
                        </View>
                        <View style={styles.arrowBtn}>
                            <Ionicons name="chevron-forward" size={14} color={Colors.textLight} />
                        </View>
                    </TouchableOpacity>

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
    }
});
