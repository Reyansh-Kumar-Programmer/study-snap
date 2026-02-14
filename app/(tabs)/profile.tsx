import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { UserRound, StarIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AnimatedView = Animated.createAnimatedComponent(View);

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={18} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <AnimatedView entering={FadeInDown.delay(100).springify()} style={styles.userSection}>
                    <View style={styles.avatarGlowContainer}>
                        <View style={styles.avatarMain}>
                            <UserRound size={48} color="white" />
                        </View>
                        <TouchableOpacity style={styles.editAvatarBtn}>
                            <Ionicons name="camera-outline" size={18} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>Alex Johnson</Text>
                    <Text style={styles.userEmail}>alex.johnson@email.com</Text>
                </AnimatedView>

                <AnimatedView entering={FadeInDown.delay(200).springify()} style={styles.achievementCard}>
                    <View style={styles.achievementIconBox}>
                        <LinearGradient colors={['#F59E0B', '#FBBF24']} style={styles.achievementGradient}>
                            <FontAwesome name="trophy" size={30} color="white" />
                        </LinearGradient>
                    </View>
                    <View style={styles.achievementDetails}>
                        <Text style={styles.achievementTitle}>Study Champion</Text>
                        <Text style={styles.achievementSub}>Completed 7-day streak</Text>
                    </View>
                    <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                </AnimatedView>

                <AnimatedView entering={FadeInDown.delay(300).springify()} style={styles.statsGrid}>
                    <View style={styles.statRow}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIconBox, { backgroundColor: '#E0F2FE' }]}>
                                <Ionicons name="camera" size={24} color="#0284C7" />
                            </View>
                            <Text style={styles.statValue}>47</Text>
                            <Text style={styles.statLabel}>Total Scans</Text>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIconBox, { backgroundColor: '#F5F3FF' }]}>
                                <MaterialCommunityIcons name="brain" size={24} color="#7C3AED" />
                            </View>
                            <Text style={styles.statValue}>23</Text>
                            <Text style={styles.statLabel}>Quizzes</Text>
                        </View>
                    </View>
                    <View style={styles.statRow}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIconBox, { backgroundColor: '#F0FDF4' }]}>
                                <Ionicons name="book" size={24} color="#16A34A" />
                            </View>
                            <Text style={styles.statValue}>156</Text>
                            <Text style={styles.statLabel}>Pages</Text>
                        </View>
                        <View style={styles.statCard}>
                            <View style={[styles.statIconBox, { backgroundColor: '#FFF7ED' }]}>
                                <MaterialCommunityIcons name="fire" size={24} color="#EA580C" />
                            </View>
                            <Text style={styles.statValue}>7</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                    </View>
                </AnimatedView>

                <AnimatedView entering={FadeInDown.delay(400).springify()}>
                    <LinearGradient
                        colors={['#2563EB', '#3B82F6']}
                        style={styles.proCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.proHeader}>
                            <MaterialCommunityIcons name="crown" size={18} color="#FBBF24" style={{ marginRight: 8 }} />
                            <Text style={styles.proLabel}>Pro Plan</Text>
                        </View>
                        <Text style={styles.proTitle}>Unlock Unlimited Scans</Text>
                        <Text style={styles.proSub}>Get unlimited scans, priority processing, and advanced AI features</Text>
                        <TouchableOpacity style={styles.upgradeBtn}>
                            <Ionicons name="sparkles" size={16} color={Colors.primary} style={{ marginRight: 8 }} />
                            <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
                        </TouchableOpacity>
                        <View style={styles.proCircle1} />
                        <View style={styles.proCircle2} />
                    </LinearGradient>
                </AnimatedView>

                <AnimatedView entering={FadeInDown.delay(500).springify()} style={styles.settingsList}>
                    <TouchableOpacity style={styles.settingsItem}>
                        <View style={styles.settingsIconBox}>
                            <Ionicons name="settings-outline" size={20} color={Colors.textLight} />
                        </View>
                        <Text style={styles.settingsText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsItem}>
                        <View style={styles.settingsIconBox}>
                            <StarIcon size={20} color={Colors.textLight} />
                        </View>
                        <Text style={styles.settingsText}>Rate App</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingsItem}>
                        <View style={styles.settingsIconBox}>
                            <Ionicons name="help-circle-outline" size={20} color={Colors.textLight} />
                        </View>
                        <Text style={styles.settingsText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                    </TouchableOpacity>
                </AnimatedView>

                <TouchableOpacity style={styles.logoutBtn}>
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 20 }} />
            </ScrollView>
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
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#3B82F608',
        zIndex: -1,
    },
    blob2: {
        position: 'absolute',
        bottom: 150,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#8B5CF605',
        zIndex: -1,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        zIndex: 10,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 20,
        color: Colors.text,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 4,
    },
    userSection: {
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 4,
    },
    avatarGlowContainer: {
        width: 110,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
    },
    avatarMain: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#2563EB',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2563EB',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.textLight,
        fontWeight: '500',
    },
    achievementCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 14,
        paddingRight: 10, // Slightly less padding on right for badge
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#FBBF24',
        shadowColor: '#F59E0B',
        shadowOffset: { width: 4, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 6,
    },
    achievementIconBox: {
        marginRight: 14, // Increased space
    },
    achievementGradient: {
        width: 52, // Increased from 44
        height: 52, // Increased from 44
        borderRadius: 14, // Slightly more rounded
        alignItems: 'center',
        justifyContent: 'center',
    },
    achievementDetails: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16, // Increased from 15
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 1,
    },
    achievementSub: {
        fontSize: 12,
        color: Colors.textLight,
        lineHeight: 16,
    },
    newBadge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 10,
    },
    newBadgeText: {
        fontSize: 10, // Slightly smaller badge text
        fontWeight: '800',
        color: 'white',
    },
    statsGrid: {
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    statCard: {
        width: '48.5%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 14, // Balanced padding
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    statIconBox: {
        width: 40, // Increased from 32
        height: 40, // Increased from 32
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10, // Balanced margin
    },
    statValue: {
        fontSize: 22, // Increased from 20
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 1,
    },
    statLabel: {
        fontSize: 13, // Increased from 12
        color: Colors.textLight,
        fontWeight: '500',
    },
    proCard: {
        padding: 20, // Increased from 18
        borderRadius: 28,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 6,
    },
    proHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    proLabel: {
        color: 'white',
        fontSize: 14, // Balanced font size
        fontWeight: '700',
    },
    proTitle: {
        color: 'white',
        fontSize: 20, // Increased from 18
        fontWeight: '700',
        marginBottom: 6,
    },
    proSub: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12.5, // Slightly larger
        lineHeight: 18,
        marginBottom: 16, // Increased space before button
        width: '85%',
    },
    upgradeBtn: {
        backgroundColor: 'white',
        paddingHorizontal: 22, // Balanced padding
        paddingVertical: 11, // Balanced padding
        borderRadius: 14, // Slightly more rounded
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    upgradeBtnText: {
        color: Colors.primary,
        fontWeight: '700',
        fontSize: 15, // Increased from 14
    },
    proCircle1: {
        position: 'absolute',
        top: -20,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    proCircle2: {
        position: 'absolute',
        bottom: -40,
        right: 15,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    settingsList: {
        marginBottom: 16,
    },
    settingsItem: {
        backgroundColor: 'white',
        padding: 14,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    settingsIconBox: {
        width: 40, // Increased from 36
        height: 40, // Increased from 36
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14, // Increased space
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    settingsText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10, // Increased padding
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#EF4444',
    }
});
