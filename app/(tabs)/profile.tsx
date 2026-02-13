import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { getHistory } from '@/services/storageService';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

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

    const handlePress = (action?: () => void) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        action?.();
    };

    const stats = [
        { label: 'Total Scans', value: history.length, icon: 'camera', color: '#3B82F6', iconSet: 'ionicons' },
        { label: 'Quizzes', value: history.reduce((acc, item) => acc + (item.quiz ? 1 : 0), 0), icon: 'brain', color: '#A855F7', iconSet: 'mci' },
        { label: 'Pages', value: 156, icon: 'book', color: '#10B981', iconSet: 'ionicons' },
        { label: 'Streak', value: 7, icon: 'flame', color: '#F97316', iconSet: 'ionicons' },
    ];

    const menuItems = [
        { icon: 'settings-outline', label: 'Settings' },
        { icon: 'star-outline', label: 'Rate App' },
        { icon: 'help-circle-outline', label: 'Help & Support' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => handlePress(() => router.back())}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Avatar Section */}
                <Animated.View
                    entering={FadeInDown.duration(600).delay(100)}
                    style={styles.avatarSection}
                >
                    <View style={styles.avatarWrapper}>
                        {/* Background glow effect */}
                        <View style={styles.avatarBackgroundGlow} />

                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            style={styles.avatarGradient}
                        >
                            <Ionicons name="person" size={64} color="white" />
                        </LinearGradient>

                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={() => handlePress()}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="camera" size={20} color="#1E293B" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>Alex Johnson</Text>
                    <Text style={styles.userEmail}>alex.johnson@email.com</Text>
                </Animated.View>

                {/* Achievement Card */}
                <Animated.View
                    entering={FadeInDown.duration(600).delay(200)}
                    style={styles.achievementWrapper}
                >
                    <View style={styles.achievementCard}>
                        <LinearGradient
                            colors={['#FFC107', '#FF9800']}
                            style={styles.trophyIcon}
                        >
                            <Ionicons name="trophy" size={28} color="white" />
                        </LinearGradient>

                        <View style={styles.achievementContent}>
                            <Text style={styles.achievementTitle}>Study Champion</Text>
                            <Text style={styles.achievementSubtitle}>Completed 7-day streak</Text>
                        </View>

                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <Animated.View
                            key={stat.label}
                            entering={FadeInDown.duration(600).delay(300 + index * 100)}
                            style={styles.statCard}
                        >
                            <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                                {stat.iconSet === 'mci' ? (
                                    <MaterialCommunityIcons name={stat.icon as any} size={24} color="white" />
                                ) : (
                                    <Ionicons name={stat.icon as any} size={24} color="white" />
                                )}
                            </View>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </Animated.View>
                    ))}
                </View>

                {/* Pro Plan Card */}
                <Animated.View
                    entering={FadeInDown.duration(600).delay(700)}
                    style={styles.proWrapper}
                >
                    <LinearGradient
                        colors={['#1E56B1', '#2563EB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.proCard}
                    >
                        {/* Decorative circles */}
                        <View style={[styles.proCircle, { top: -30, right: -30, width: 120, height: 120 }]} />
                        <View style={[styles.proCircle, { bottom: -40, left: -20, width: 100, height: 100 }]} />

                        <View style={styles.proContent}>
                            <View style={styles.proHeader}>
                                <MaterialCommunityIcons name="crown-outline" size={24} color="#FFD700" />
                                <Text style={styles.proLabel}>Pro Plan</Text>
                            </View>

                            <Text style={styles.proTitle}>Unlock Unlimited Scans</Text>
                            <Text style={styles.proSubtitle}>
                                Get unlimited scans, priority processing, and advanced AI features
                            </Text>

                            <TouchableOpacity
                                style={styles.upgradeButton}
                                onPress={() => handlePress()}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="sparkles-outline" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Menu Items */}
                <View style={styles.menuList}>
                    {menuItems.map((item, index) => (
                        <Animated.View
                            key={item.label}
                            entering={FadeInDown.duration(600).delay(800 + index * 100)}
                        >
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handlePress()}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuIconContainer}>
                                    <Ionicons name={item.icon as any} size={22} color="#64748B" />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Log Out */}
                <Animated.View entering={FadeInDown.duration(600).delay(1100)}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => handlePress()}
                        activeOpacity={0.7}
                    >
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
        backgroundColor: '#FCFDFF',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: '#FCFDFF',
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
    },

    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarWrapper: {
        position: 'relative',
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarBackgroundGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#3B82F6',
        opacity: 0.15,
    },
    avatarGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#3B82F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FCFDFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 2,
    },
    userName: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2563EB',
        marginBottom: 6,
    },
    userEmail: {
        fontSize: 15,
        color: '#94A3B8',
        fontWeight: '500',
    },

    // Achievement Card
    achievementWrapper: {
        marginBottom: 24,
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 28,
        borderWidth: 2.5,
        borderColor: '#FFC107',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 5,
    },
    trophyIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    achievementContent: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    achievementSubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
    newBadge: {
        backgroundColor: '#FFB800',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
    },
    newBadgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '800',
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statCard: {
        width: (width - 64) / 2,
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 28,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
    },

    // Pro Plan Card
    proWrapper: {
        marginBottom: 32,
        marginTop: 8,
    },
    proCard: {
        borderRadius: 32,
        padding: 28,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 2.5,
        borderColor: 'rgba(255,255,255,0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
    },
    proCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 100,
    },
    proContent: {
        zIndex: 2,
    },
    proHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    proLabel: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },
    proTitle: {
        color: 'white',
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    proSubtitle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 24,
        fontWeight: '500',
    },
    upgradeButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 20,
        alignSelf: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    upgradeButtonText: {
        color: '#2563EB',
        fontWeight: '800',
        fontSize: 16,
    },

    // Menu Items
    menuList: {
        marginBottom: 32,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },

    // Log Out
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginBottom: 20,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 17,
        fontWeight: '700',
    },
});
