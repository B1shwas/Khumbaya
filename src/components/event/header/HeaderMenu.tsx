import { MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

export const HeaderMenu = ({ items }: { items: MenuItem[] }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="p-2 rounded-xl bg-white/5"
        hitSlop={20}
      >
        <MoreVertical size={24} color="#FFFFFF" />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-start items-end pt-[60px] pr-5"
          onPress={() => setVisible(false)}
        >
          <Animated.View
            entering={FadeInDown.duration(200)}
            className="bg-[#1a1a1f] rounded-2xl border border-white/10 min-w-[200px] overflow-hidden shadow-xl"
          >
            {items.map((item, index) => (
              <Pressable
                key={index}
                className={`flex-row items-center gap-3 p-4 ${
                  index < items.length - 1 ? "border-b border-white/5" : ""
                } ${item.danger ? "bg-[#FF4B6E]/5" : ""}`}
                onPress={() => {
                  item.onPress();
                  setVisible(false);
                }}
              >
                <item.icon
                  size={20}
                  color={item.danger ? '#FF4B6E' : 'rgba(255,255,255,0.8)'}
                />
                <Text
                  className={`text-[15px] font-medium ${
                    item.danger ? "text-[#FF4B6E]" : "text-white/90"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};
