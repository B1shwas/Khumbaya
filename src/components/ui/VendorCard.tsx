import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import React, { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

export interface VendorCardProps {
    name: string;
    type: string;
    price: string;
    status: 'contracted' | 'deposit' | 'pending' | 'paid';
    imageUrl: string;
    icon: 'venue' | 'catering' | 'photo' | 'music';
    action: 'chat' | 'call' | 'email';
    onPressAction: () => void;
}

const STATUS_CONFIG = {
    contracted: {
        label: 'Contracted',
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        ring: 'ring-blue-700/10 dark:ring-blue-400/20'
    },
    deposit: {
        label: 'Deposit Paid',
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-300',
        ring: 'ring-amber-600/20 dark:ring-amber-400/20'
    },
    pending: {
        label: 'Pending',
        bg: 'bg-slate-50 dark:bg-slate-700',
        text: 'text-slate-600 dark:text-slate-300',
        ring: 'ring-slate-500/10 dark:ring-slate-400/20'
    },
    paid: {
        label: 'Paid in Full',
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        ring: 'ring-green-600/20 dark:ring-green-500/20'
    },
};

const ICON_MAPPING = {
    venue: 'location-on',
    catering: 'restaurant',
    photo: 'camera-alt',
    music: 'music-note',
    chat: 'chat',
    call: 'call',
    email: 'email',
};

const VendorCard = memo<VendorCardProps>(({
    name, type, price, status, imageUrl, icon, action, onPressAction
}) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const statusStyle = STATUS_CONFIG[status];

    return (
        <Pressable
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/50 p-4 mb-4 active:opacity-95 shadow-md shadow-primary/10"
            android_ripple={{ color: isDark ? '#3f3f46' : '#f3f4f6' }}
            accessibilityRole="button"
            accessibilityLabel={`Vendor: ${name}, ${type}, ${price}`}
        >
            <View className="flex-row justify-between items-center">
                {/* Vendor Info */}
                <View className="flex-1 flex-row items-center mr-3">
                    <View className="relative mr-4">
                        <Image
                            source={{ uri: imageUrl }}
                            className="w-16 h-16 rounded-2xl"
                            resizeMode="cover"
                            accessibilityIgnoresInvertColors
                        />
                        <View className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1.5 border border-gray-50 dark:border-gray-700 shadow-sm">
                            <MaterialIcons
                                name={ICON_MAPPING[icon] as any}
                                size={14}
                                color="#ee2b8c"
                            />
                        </View>
                    </View>

                    <View className="flex-1 justify-center min-w-0">
                        <Text className="text-slate-900 dark:text-white text-base font-bold leading-tight mb-0.5" numberOfLines={1}>
                            {name}
                        </Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1.5" numberOfLines={1}>
                            {type}
                        </Text>
                        <View className="flex-row">
                            <View className={`inline-flex flex-row items-center rounded-lg px-2.5 py-1 ${statusStyle.bg} ${statusStyle.ring} border border-transparent`}>
                                <Text className={`text-[10px] font-bold uppercase tracking-wider ${statusStyle.text}`}>{statusStyle.label}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Price & Action */}
                <View className="items-end gap-y-2">
                    <Text className="text-primary font-bold text-lg">
                        {price}
                    </Text>
                    <Pressable
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center active:bg-primary/20"
                        onPress={onPressAction}
                        accessibilityLabel={`Contact ${name} via ${action}`}
                        accessibilityRole="button"
                    >
                        <MaterialIcons
                            name={ICON_MAPPING[action] as any}
                            size={20}
                            color="#ee2b8c"
                        />
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
});

export default VendorCard;