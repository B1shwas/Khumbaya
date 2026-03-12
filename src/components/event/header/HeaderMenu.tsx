// components/header/HeaderMenu.tsx
import { MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';
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
      {/* Three Dot Button */}
      <Pressable 
        onPress={() => setVisible(true)}
        style={styles.menuButton}
        hitSlop={20}
      >
        <MoreVertical size={24} color="#FFFFFF" />
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable 
          style={styles.overlay} 
          onPress={() => setVisible(false)}
        >
          <Animated.View 
            entering={FadeInDown.duration(200)}
            style={styles.dropdown}
          >
            {items.map((item, index) => (
              <Pressable
                key={index}
                style={[
                  styles.menuItem,
                  index === items.length - 1 && styles.menuItemLast,
                  item.danger && styles.dangerItem
                ]}
                onPress={() => {
                  item.onPress();
                  setVisible(false);
                }}
              >
                <item.icon 
                  size={20} 
                  color={item.danger ? '#FF4B6E' : 'rgba(255,255,255,0.8)'} 
                />
                <Text style={[
                  styles.menuText,
                  item.danger && styles.dangerText
                ]}>
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

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  dropdown: {
    backgroundColor: '#1a1a1f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minWidth: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  dangerItem: {
    backgroundColor: 'rgba(255,75,110,0.05)',
  },
  menuText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '500',
  },
  dangerText: {
    color: '#FF4B6E',
  },
});