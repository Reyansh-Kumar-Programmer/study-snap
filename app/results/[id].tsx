import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import Colors from '@/constants/Colors';
import { getHistory } from '@/services/storageService';
import ExplanationView from '@/components/results/ExplanationView';
import SummaryView from '@/components/results/SummaryView';
import QuizView from '@/components/results/QuizView';

const TABS = ['Explanation', 'Summary', 'Quiz'];

export default function ResultScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Explanation');

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
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Result not found</Text>
            </View>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Explanation':
                return <ExplanationView content={data.explanation} />;
            case 'Summary':
                return <SummaryView points={data.summary} />;
            case 'Quiz':
                return <QuizView questions={data.quiz} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Results', headerBackTitle: 'Back' }} />

            <View style={styles.tabContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray[100],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: Colors.text,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        color: Colors.text,
        fontWeight: '600',
    },
    activeTabText: {
        color: 'white',
    },
    content: {
        flex: 1,
    }
});
