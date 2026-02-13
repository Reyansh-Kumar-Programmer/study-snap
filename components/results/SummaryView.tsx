import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

interface SummaryViewProps {
    points: string[];
}

export default function SummaryView({ points }: SummaryViewProps) {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Summary</Text>
            {points.map((point, index) => (
                <View key={index} style={styles.card}>
                    <FontAwesome name="circle" size={8} color={Colors.primary} style={styles.bullet} />
                    <Text style={styles.text}>{point}</Text>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray[100],
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        ...Colors.shadow,
    },
    bullet: {
        marginTop: 8,
        marginRight: 12,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.text,
        flex: 1,
    }
});
