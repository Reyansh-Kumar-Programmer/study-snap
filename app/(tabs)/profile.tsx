import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { getHistory } from '@/services/storageService';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const router = useRouter();
    const [history, setHistory] = useState<any[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        const data = await getHistory();
        setHistory(data);
    };

    const stats = [
        { label: 'Total Scans', value: history.length, icon: 'camera', color: '#3B82F6' },
        { label: 'Quizzes', value: history.reduce((acc, item) => acc + (item.quiz ? 1 : 0), 0), icon: 'brain', color: '#A855F7' },
        { label: 'Pages', value: 156, icon: 'book', color: '#10B981' }, // Placeholder
        { label: 'Streak', value: 7, icon: 'flame', color: '#F59E0B' }, // Placeholder
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Info */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            style={styles.avatarGradient}
                        >
                            <Ionicons name="person" size={60} color="white" />
                        </LinearGradient>
                        <TouchableOpacity style={styles.cameraOverlay}>
                            <Ionicons name="camera" size={18} color={Colors.text} />
                        </TouchableOpacity>
                        <View style={styles.avatarGlow} />
                    </View>
                    <Text style={styles.userName}>Alex Johnson</Text>
                    <Text style={styles.userEmail}>alex.johnson@email.com</Text>
                </Animated.View>

                {/* Study Champion Badge */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.achievementCard}>
                    <View style={[styles.achievementIcon, { backgroundColor: '#F59E0B' }]}>
                        <Ionicons name="trophy" size={28} color="white" />
                        <View style={styles.iconGlow} />
                    </View>
                    <View style={styles.achievementContent}>
                        <Text style={styles.achievementTitle}>Study Champion</Text>
                        <Text style={styles.achievementSubtitle}>Completed 7-day streak</Text>
                    </View>
                    <View style={styles.badgeNew}>
                        <Text style={styles.badgeNewText}>NEW</Text>
                    </View>
                </Animated.View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <Animated.View
                            key={stat.label}
                            entering={FadeInDown.delay(300 + index * 100)}
                            style={styles.statCard}
                        >
                            <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </Animated.View>
                    ))}
                </View>

                {/* Pro Plan Card */}
                <Animated.View entering={FadeInDown.delay(700)}>
                    <LinearGradient
                        colors={['#2563EB', '#3B82F6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.promoCard}
                    >
                        <View style={styles.promoContent}>
                            <View style={styles.promoHeader}>
                                <Ionicons name="ribbon" size={20} color="#FFD700" />
                                <Text style={styles.promoLabel}>Pro Plan</Text>
                            </View>
                            <Text style={styles.promoTitle}>Unlock Unlimited Scans</Text>
                            <Text style={styles.promoSubtitle}>Get unlimited scans, priority processing, and advanced AI features</Text>

                            <TouchableOpacity style={styles.promoButton}>
                                <Ionicons name="sparkles" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                                <Text style={styles.promoButtonText}>Upgrade Now</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Decorative Circles */}
                        <View style={[styles.promoCircle, { top: -20, right: -20, width: 100, height: 100, opacity: 0.1 }]} />
                        <View style={[styles.promoCircle, { bottom: -30, left: -20, width: 120, height: 120, opacity: 0.1 }]} />
                    </LinearGradient>
                </Animated.View>

                {/* Menu Items */}
                <Animated.View entering={FadeInDown.delay(800)} style={styles.menuContainer}>
                    {[
                        { icon: 'settings-outline', label: 'Settings' },
                        { icon: 'star-outline', label: 'Rate App' },
                        { icon: 'help-circle-outline', label: 'Help & Support' },
                    ].map((item, index) => (
                        <TouchableOpacity key={item.label} style={styles.menuItem}>
                            <View style={styles.menuItemIcon}>
                                <Ionicons name={item.icon as any} size={22} color={Colors.textLight} />
                            </View>
                            <Text style={styles.menuItemLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.gray[300]} />
                        </TouchableOpacity>
                    ))}
                </Animated.View>

                {/* Log Out */}
                <Animated.View entering={FadeInDown.delay(900)}>
                    <TouchableOpacity style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={22} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    avatarGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    avatarGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 60,
        backgroundColor: '#3B82F6',
        opacity: 0.2,
        transform: [{ scale: 1.15 }],
        filter: 'blur(15px)', // Note: standard CSS blur doesn't work in RN, use elevation/shadow
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: 'white',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        ...Colors.shadow,
    },
    userName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2563EB',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.textLight,
        fontWeight: '500',
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
        ...Colors.shadow,
        shadowOpacity: 0.05,
    },
    achievementIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'inherit',
        opacity: 0.3,
        borderRadius: 16,
        transform: [{ scale: 1.2 }],
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 2,
    },
    achievementSubtitle: {
        fontSize: 13,
        color: Colors.textLight,
    },
    badgeNew: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeNewText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '800',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: (width - 60) / 2,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
        ...Colors.shadow,
        shadowOpacity: 0.05,
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: Colors.textLight,
        fontWeight: '500',
    },
    promoCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    promoContent: {
        zIndex: 2,
    },
    promoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    promoLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
    },
    promoTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 8,
    },
    promoSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 20,
    },
    promoButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 16,
        alignSelf: 'flex-start',
        paddingHorizontal: 24,
    },
    promoButtonText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 15,
    },
    promoCircle: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 100,
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 8,
        marginBottom: 24,
        ...Colors.shadow,
        shadowOpacity: 0.05,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuItemLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '700',
    }
});
