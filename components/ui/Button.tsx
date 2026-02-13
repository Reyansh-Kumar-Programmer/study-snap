import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { forwardRef } from 'react';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

export const Button = forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon
}, ref) => {

    const getBackgroundColor = () => {
        if (disabled) return Colors.gray[300];
        switch (variant) {
            case 'primary': return Colors.primary;
            case 'secondary': return Colors.secondary;
            case 'outline': return 'transparent';
            case 'ghost': return 'transparent';
            default: return Colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return Colors.gray[100]; // Lighter gray for disabled text
        switch (variant) {
            case 'primary': return Colors.white;
            case 'secondary': return Colors.white;
            case 'outline': return Colors.primary;
            case 'ghost': return Colors.primary;
            default: return Colors.white;
        }
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 1, borderColor: Colors.primary };
        return {};
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm': return { paddingVertical: 8, paddingHorizontal: 16 };
            case 'md': return { paddingVertical: 12, paddingHorizontal: 24 };
            case 'lg': return { paddingVertical: 16, paddingHorizontal: 32 };
            default: return { paddingVertical: 12, paddingHorizontal: 24 };
        }
    };

    return (
        <TouchableOpacity
            ref={ref}
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                getSizeStyles(),
                style,
                disabled && styles.disabled
            ]}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {icon && icon}
                    <Text style={[
                        styles.text,
                        { color: getTextColor(), fontSize: size === 'lg' ? 18 : 16 },
                        textStyle,
                        icon ? { marginLeft: 8 } : {}
                    ]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...Colors.shadow,
    },
    disabled: {
        opacity: 0.6,
        shadowOpacity: 0,
    },
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
});
