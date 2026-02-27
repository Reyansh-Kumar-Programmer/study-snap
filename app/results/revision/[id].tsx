import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { getHistory } from '@/services/storageService';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RevisionSheetsScreen() {
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
                colors={['#F8FAFC', '#EFF6FF']}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <Ionicons name="chevron-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleBox}>
                    <Text style={styles.headerTitle}>Revision Sheets</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{data.summary.length} Key Points</Text>
                    </View>
                </View>
                <View style={[styles.headerBtn, { opacity: 0 }]} />
            </View>

            <ScrollView 
                style={styles.content} 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                {data.summary.map((point: string, index: number) => {
                    return (
                        <Animated.View 
                            key={index} 
                            entering={FadeInDown.delay(100 * index).springify()} 
                            style={styles.card}
                        >
                            <View style={styles.cardNumberBox}>
                                <Text style={styles.cardNumber}>{index + 1}</Text>
                            </View>
                            <Text style={styles.cardText}>{point}</Text>
                        </Animated.View>
                    );
                })}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
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
        backgroundColor: 'rgba(255,255,255,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadow,
        shadowOpacity: 0.05,
    },
    headerTitleBox: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.text,
        letterSpacing: -0.5,
    },
    badge: {
        marginTop: 4,
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        color: '#4F46E5',
        fontWeight: '700',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        ...Colors.shadow,
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardNumberBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.primary,
    },
    cardText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: Colors.text,
        fontWeight: '500',
    },
});
