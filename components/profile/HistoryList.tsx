import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HistoryItem {
    id: string;
    date: string;
    explanation: string; // Preview
    // other fields
}

interface HistoryListProps {
    history: HistoryItem[];
}

export default function HistoryList({ history }: HistoryListProps) {
    const router = useRouter();

    const renderItem = ({ item }: { item: HistoryItem }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/results/${item.id}`)}
        >
            <View style={styles.iconContainer}>
                <FontAwesome name="file-text" size={20} color={Colors.primary} />
            </View>
            <View style={styles.info}>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                <Text style={styles.preview} numberOfLines={1}>
                    {item.explanation.substring(0, 50)}...
                </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={Colors.gray[300]} />
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No history yet.</Text>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        padding: 24,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        ...Colors.shadow,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    date: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 4,
    },
    preview: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    empty: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: Colors.textLight,
        fontSize: 16,
    }
});
