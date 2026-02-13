import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { getHistory } from '@/services/storageService';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

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
        { label: 'Total Scans', value: 47, icon: 'camera', color: '#3B82F6' },
        { label: 'Quizzes', value: 23, icon: 'brain', color: '#A855F7' },
        { label: 'Pages', value: 156, icon: 'book', color: '#10B981' },
        { label: 'Streak', value: 7, icon: 'fire', color: '#F97316' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color={Colors.text} />
                    <View style={styles.backButtonGlow} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Info */}
                <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.profileSection}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarMainGlow} />
                        <View style={styles.avatarSecondaryGlow} />
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB']}
                                style={styles.avatarGradient}
                            >
                                <Ionicons name="person-outline" size={54} color="white" />
                            </LinearGradient>
                            <TouchableOpacity style={styles.cameraOverlay}>
                                <Ionicons name="camera-outline" size={18} color="#475569" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={styles.userName}>Alex Johnson</Text>
                    <Text style={styles.userEmail}>alex.johnson@email.com</Text>
                </Animated.View>

                {/* Study Champion Card */}
                <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.cardContainer}>
                    <View style={styles.achievementCard}>
                        <View style={styles.cardGlow} />
                        <LinearGradient
                            colors={['#FFC107', '#FF9800']}
                            style={styles.achievementIcon}
                        >
                            <FontAwesome name="trophy" size={28} color="white" />
                        </LinearGradient>
                        <View style={styles.achievementContent}>
                            <Text style={styles.achievementLabel}>Study</Text>
                            <Text style={styles.achievementTitle}>Champion</Text>
                            <Text style={styles.achievementSubtitle}>Completed 7-day streak</Text>
                        </View>
                        <View style={styles.badgeNew}>
                            <Text style={styles.badgeNewText}>NEW</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <Animated.View
                            key={stat.label}
                            entering={FadeInDown.duration(600).delay(300 + index * 100)}
                            style={styles.statCardContainer}
                        >
                            <View style={styles.statCard}>
                                <View style={styles.cardGlow} />
                                <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                                    <FontAwesome name={stat.icon as any} size={20} color="white" />
                                </View>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* Pro Plan Banner */}
                <Animated.View entering={FadeInDown.duration(600).delay(700)} style={styles.promoContainer}>
                    <LinearGradient
                        colors={['#1D4ED8', '#3B82F6', '#60A5FA']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.promoCard}
                    >
                        {/* Glassmorphic circles */}
                        <View style={[styles.promoBgCircle, { top: -20, right: -20, width: 120, height: 120 }]} />
                        <View style={[styles.promoBgCircle, { bottom: -40, left: 10, width: 90, height: 90 }]} />

                        <View style={styles.promoContent}>
                            <View style={styles.promoHeader}>
                                <Ionicons name="ribbon" size={18} color="#FFD700" />
                                <Text style={styles.promoLabel}>Pro Plan</Text>
                            </View>
                            <Text style={styles.promoTitle}>Unlock Unlimited Scans</Text>
                            <Text style={styles.promoSubtitle}>Get unlimited scans, priority processing, and advanced AI features</Text>

                            <TouchableOpacity style={styles.promoButton}>
                                <Ionicons name="sparkles" size={16} color="#1D4ED8" style={{ marginRight: 8 }} />
                                <Text style={styles.promoButtonText}>Upgrade Now</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                    <View style={styles.promoBannerShadow} />
                </Animated.View>

                {/* Settings Menu */}
                <Animated.View entering={FadeInDown.duration(600).delay(800)} style={styles.menuWrapper}>
                    <View style={styles.menuContainer}>
                        <View style={styles.cardGlow} />
                        {[
                            { icon: 'settings-outline', label: 'Settings' },
                            { icon: 'star-outline', label: 'Rate App' },
                            { icon: 'help-circle-outline', label: 'Help & Support' },
                        ].map((item, index) => (
                            <TouchableOpacity key={item.label} style={[styles.menuItem, index === 2 && { borderBottomWidth: 0 }]}>
                                <View style={styles.menuItemIcon}>
                                    <Ionicons name={item.icon as any} size={20} color="#64748B" />
                                </View>
                                <Text style={styles.menuItemLabel}>{item.label}</Text>
                                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* Log Out */}
                <Animated.View entering={FadeInDown.duration(600).delay(900)}>
                    <TouchableOpacity style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={22} color="#F87171" style={{ marginRight: 10 }} />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 10,
            },
            android: {
                elevation: 6,
            }
        }),
    },
    backButtonGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 14,
        backgroundColor: '#F1F5F9',
        zIndex: -1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: -0.5,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
    },
    avatarWrapper: {
        position: 'relative',
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarMainGlow: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#3B82F6',
        opacity: 0.25,
        transform: [{ scale: 1.8 }],
        ...Platform.select({
            ios: {
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 30,
            }
        })
    },
    avatarSecondaryGlow: {
        position: 'absolute',
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#60A5FA',
        opacity: 0.15,
        transform: [{ scale: 1.4 }],
        ...Platform.select({
            ios: {
                shadowColor: '#60A5FA',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            }
        })
    },
    avatarContainer: {
        position: 'relative',
        zIndex: 2,
    },
    avatarGradient: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#2563EB',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
            },
            android: {
                elevation: 12,
            }
        }),
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: 'white',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            }
        }),
    },
    userName: {
        fontSize: 30,
        fontWeight: '800',
        color: '#2563EB',
        marginBottom: 6,
        letterSpacing: -1,
    },
    userEmail: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '500',
    },
    cardContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 28,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
            },
            android: {
                elevation: 4,
            }
        }),
    },
    cardGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 28,
        zIndex: -1,
        backgroundColor: '#FFFFFF',
    },
    achievementIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            }
        }),
    },
    achievementContent: {
        flex: 1,
    },
    achievementLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    achievementTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    achievementSubtitle: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    badgeNew: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 14,
        ...Platform.select({
            ios: {
                shadowColor: '#F59E0B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 4,
            }
        }),
    },
    badgeNewText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '900',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statCardContainer: {
        width: (width - 64) / 2,
        marginBottom: 24,
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.06,
                shadowRadius: 20,
            },
            android: {
                elevation: 5,
            }
        }),
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
            android: {
                elevation: 6,
            }
        }),
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
        letterSpacing: -1,
    },
    statLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    promoContainer: {
        position: 'relative',
        marginBottom: 32,
    },
    promoCard: {
        borderRadius: 32,
        padding: 30,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#2563EB',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.25,
                shadowRadius: 24,
            },
            android: {
                elevation: 10,
            }
        }),
    },
    promoBannerShadow: {
        position: 'absolute',
        bottom: -15,
        left: '10%',
        right: '10%',
        height: 30,
        backgroundColor: '#3B82F6',
        opacity: 0.2,
        zIndex: -1,
        ...Platform.select({
            ios: {
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
            }
        })
    },
    promoBgCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 100,
    },
    promoContent: {
        zIndex: 2,
    },
    promoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    promoLabel: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 10,
    },
    promoTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 10,
        letterSpacing: -0.5,
    },
    promoSubtitle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
        fontWeight: '500',
    },
    promoButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 18,
        alignSelf: 'flex-start',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
            },
            android: {
                elevation: 6,
            }
        }),
    },
    promoButtonText: {
        color: '#1D4ED8',
        fontWeight: '800',
        fontSize: 16,
    },
    menuWrapper: {
        marginBottom: 32,
    },
    menuContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.05,
                shadowRadius: 16,
            },
            android: {
                elevation: 4,
            }
        }),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    menuItemIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },
    menuItemLabel: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#FEF2F2',
        borderRadius: 24,
        marginHorizontal: 40,
        ...Platform.select({
            ios: {
                shadowColor: '#F87171',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            }
        }),
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 17,
        fontWeight: '700',
    }
});
