import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { useEffect, useState } from 'react';
import { getHistory } from '@/services/storageService';
import HistoryList from '@/components/profile/HistoryList';
import { useFocusEffect } from 'expo-router';
import React from 'react';

export default function ProfileScreen() {
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Profile</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{history.length}</Text>
                    <Text style={styles.statLabel}>Total Snaps</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                        {history.reduce((acc: number, item: any) => acc + (item.quiz ? 1 : 0), 0)}
                    </Text>
                    <Text style={styles.statLabel}>Quizzes Taken</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>History</Text>
            <HistoryList history={history} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray[100],
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginHorizontal: 4,
        alignItems: 'center',
        ...Colors.shadow,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textLight,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginLeft: 24,
        marginBottom: 16,
    }
});
