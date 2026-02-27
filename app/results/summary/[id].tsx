import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { getHistory } from '@/services/storageService';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SummaryScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const history = await getHistory();
            const item = history.find((h: any) => h.id === id);
            if (item) {
                setData(item);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!data) return <SafeAreaView style={styles.container} />;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Stack.Screen options={{ headerShown: false }} />
            
            <LinearGradient
                colors={['#FFFBEB', '#FEF3C7', '#FFFFFF']}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleBox}>
                    <Text style={styles.headerTitle}>Quick Summary</Text>
                </View>
                <TouchableOpacity style={styles.headerBtn}>
                    <Ionicons name="share-outline" size={22} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.content} 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInDown.springify()} style={styles.iconContainer}>
                     <LinearGradient
                        colors={['#FDE68A', '#D97706']}
                        style={styles.iconCircle}
                    >
                        <FontAwesome5 name="bolt" size={32} color="#FFFFFF" />
                    </LinearGradient>
                </Animated.View>

                <Animated.Text entering={FadeInUp.delay(100).springify()} style={styles.titleText}>
                    Topic Overview
                </Animated.Text>
                <Animated.Text entering={FadeInUp.delay(150).springify()} style={styles.dateText}>
                    Scanned on {new Date(data.date).toLocaleDateString()}
                </Animated.Text>

                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.summaryCard}>
                    <View style={styles.quoteIconBox}>
                        <FontAwesome5 name="quote-left" size={20} color="#D97706" style={{ opacity: 0.2 }} />
                    </View>
                    <Text style={styles.summaryText}>
                        {data.explanation}
                    </Text>
                    <View style={styles.quoteIconBoxRight}>
                        <FontAwesome5 name="quote-right" size={20} color="#D97706" style={{ opacity: 0.2 }} />
                    </View>
                </Animated.View>
                
                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'transparent',
    },
    headerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadow,
        shadowOpacity: 0.05,
    },
    headerTitleBox: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 32,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadow,
        shadowColor: '#D97706',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 16,
    },
    titleText: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    dateText: {
        fontSize: 15,
        color: Colors.textLight,
        fontWeight: '500',
        marginBottom: 32,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 32,
        width: '100%',
        ...Colors.shadow,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    summaryText: {
        fontSize: 17,
        lineHeight: 28,
        color: Colors.text,
        fontWeight: '500',
        textAlign: 'center',
    },
    quoteIconBox: {
        position: 'absolute',
        top: 24,
        left: 24,
    },
    quoteIconBoxRight: {
        position: 'absolute',
        bottom: 24,
        right: 24,
    }
});
