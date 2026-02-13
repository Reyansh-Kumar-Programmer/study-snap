import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { getHistory } from '@/services/storageService';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const router = useRouter();
    const [history, setHistory] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        const data = await getHistory();
        setHistory(data);
    };

    const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const totalScans = history.length;
    const totalQuizzes = history.reduce((acc: number, item: any) => acc + (item.quiz ? 1 : 0), 0);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => { haptic(); router.back(); }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ── Avatar ── */}
                <Animated.View entering={FadeInDown.duration(500).delay(100).springify()} style={styles.avatarSection}>
                    <View style={styles.avatarOuter}>
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            style={styles.avatarGradient}
                        >
                            <Ionicons name="person" size={52} color="white" />
                        </LinearGradient>

                        <TouchableOpacity
                            style={styles.cameraBtn}
                            onPress={haptic}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="camera" size={16} color="#1E293B" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>Alex Johnson</Text>
                    <Text style={styles.userEmail}>alex.johnson@email.com</Text>
                </Animated.View>

                {/* ── Achievement Banner ── */}
                <Animated.View entering={FadeInDown.duration(500).delay(200).springify()}>
                    <View style={styles.achievementCard}>
                        <LinearGradient
                            colors={['#FFC107', '#FF9800']}
                            style={styles.trophyPill}
                        >
                            <Ionicons name="trophy" size={24} color="white" />
                        </LinearGradient>

                        <View style={styles.achievementText}>
                            <Text style={styles.achievementTitle}>Study Champion</Text>
                            <Text style={styles.achievementSub}>Completed 7-day streak</Text>
                        </View>

                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* ── Stats Row ── */}
                <Animated.View entering={FadeInDown.duration(500).delay(300).springify()} style={styles.statsRow}>
                    {[
                        { icon: 'camera', color: '#3B82F6', bg: '#DBEAFE', value: totalScans, label: 'Scans' },
                        { icon: 'bulb', color: '#8B5CF6', bg: '#EDE9FE', value: totalQuizzes, label: 'Quizzes' },
                        { icon: 'flame', color: '#F59E0B', bg: '#FEF3C7', value: 7, label: 'Streak' },
                    ].map((s, i) => (
                        <View key={i} style={styles.statCard}>
                            <View style={[styles.statIconPill, { backgroundColor: s.bg }]}>
                                <Ionicons name={s.icon as any} size={20} color={s.color} />
                            </View>
                            <Text style={styles.statValue}>{s.value}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* ── Pro Upgrade ── */}
                <Animated.View entering={FadeInDown.duration(500).delay(400).springify()}>
                    <LinearGradient
                        colors={['#1E56B1', '#2563EB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.proCard}
                    >
                        {/* decorative circles */}
                        <View style={[styles.proCircle, { top: -25, right: -25, width: 100, height: 100 }]} />
                        <View style={[styles.proCircle, { bottom: -30, left: -15, width: 80, height: 80 }]} />

                        <View style={styles.proContent}>
                            <View style={styles.proHeader}>
                                <MaterialCommunityIcons name="crown-outline" size={22} color="#FFD700" />
                                <Text style={styles.proLabel}>Pro Plan</Text>
                            </View>

                            <Text style={styles.proTitle}>Unlock Unlimited Scans</Text>
                            <Text style={styles.proSub}>Priority processing & advanced AI features</Text>

                            <TouchableOpacity
                                style={styles.upgradeBtn}
                                onPress={haptic}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="sparkles" size={18} color="#2563EB" style={{ marginRight: 6 }} />
                                <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* ── Menu ── */}
                <Animated.View entering={FadeInDown.duration(500).delay(500).springify()}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    {[
                        { icon: 'settings-outline', label: 'Settings', color: '#3B82F6', bg: '#DBEAFE' },
                        { icon: 'star-outline', label: 'Rate App', color: '#F59E0B', bg: '#FEF3C7' },
                        { icon: 'help-circle-outline', label: 'Help & Support', color: '#10B981', bg: '#D1FAE5' },
                    ].map((m, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.menuItem}
                            onPress={haptic}
                            activeOpacity={0.6}
                        >
                            <View style={[styles.menuIcon, { backgroundColor: m.bg }]}>
                                <Ionicons name={m.icon as any} size={20} color={m.color} />
                            </View>
                            <Text style={styles.menuLabel}>{m.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                {/* ── Logout ── */}
                <Animated.View entering={FadeInDown.duration(500).delay(600).springify()}>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={haptic}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

/* ───────────────────────── Styles ───────────────────────── */

const CARD_SHADOW = Platform.select({
    ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.10,
        shadowRadius: 18,
    },
    android: { elevation: 5 },
}) as any;

const CARD_BORDER = {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
};

const styles = StyleSheet.create({
    /* ── Layout ── */
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 4,
    },

    /* ── Header ── */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: '#F8FAFC',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        ...CARD_BORDER,
        ...CARD_SHADOW,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: -0.3,
    },

    /* ── Avatar ── */
    avatarSection: {
        alignItems: 'center',
        marginBottom: 28,
        marginTop: 8,
    },
    avatarOuter: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarGradient: {
        width: 110,
        height: 110,
        borderRadius: 55,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 14 },
                shadowOpacity: 0.28,
                shadowRadius: 24,
            },
            android: { elevation: 10 },
        }),
    },
    cameraBtn: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F8FAFC',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
            },
            android: { elevation: 4 },
        }),
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },

    /* ── Achievement ── */
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 24,
        marginBottom: 24,
        ...CARD_BORDER,
        ...CARD_SHADOW,
    },
    trophyPill: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    achievementText: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 2,
    },
    achievementSub: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },
    newBadge: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    newBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#D97706',
    },

    /* ── Stats ── */
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        width: (width - 56) / 3,
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 24,
        alignItems: 'center',
        ...CARD_BORDER,
        ...CARD_SHADOW,
    },
    statIconPill: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },

    /* ── Pro ── */
    proCard: {
        borderRadius: 28,
        padding: 24,
        marginBottom: 28,
        overflow: 'hidden',
        position: 'relative',
        ...CARD_BORDER,
        borderColor: 'rgba(255,255,255,0.15)',
        ...Platform.select({
            ios: {
                shadowColor: '#2563EB',
                shadowOffset: { width: 0, height: 14 },
                shadowOpacity: 0.30,
                shadowRadius: 24,
            },
            android: { elevation: 10 },
        }),
    },
    proCircle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    proContent: {
        position: 'relative',
        zIndex: 1,
    },
    proHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    proLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.85)',
        marginLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    proTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: 'white',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    proSub: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 18,
        lineHeight: 20,
    },
    upgradeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'white',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 16,
    },
    upgradeBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2563EB',
    },

    /* ── Menu ── */
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 14,
        letterSpacing: -0.2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        ...CARD_BORDER,
        ...CARD_SHADOW,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
    },

    /* ── Logout ── */
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        marginTop: 8,
        borderRadius: 20,
        backgroundColor: '#FEF2F2',
        ...CARD_BORDER,
        borderColor: '#FECACA',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#EF4444',
    },
});
