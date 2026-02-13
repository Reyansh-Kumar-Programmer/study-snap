import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'studysnap_history';

export const saveResult = async (result: any) => {
    try {
        const existing = await getHistory();
        const updated = [result, ...existing];
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save result', e);
    }
};

export const getHistory = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Failed to fetch history', e);
        return [];
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (e) {
        console.error('Failed to clear history', e);
    }           
}
