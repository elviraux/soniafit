import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

interface CustomHeaderProps {
  showBack?: boolean;
  title?: string;
  showMenu?: boolean;
}

export default function CustomHeader({ showBack = false, title, showMenu = true }: CustomHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getCartItemCount } = useApp();
  const cartCount = getCartItemCount();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>FREE SHIPPING. SHIPS IN 24 HOURS*</Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        {/* Left - Menu or Back */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            if (showBack) {
              router.back();
            }
            // Menu functionality can be added later
          }}
        >
          {showBack ? (
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          ) : showMenu ? (
            <Ionicons name="menu" size={24} color={Colors.primary} />
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </TouchableOpacity>

        {/* Center - Logo */}
        <View style={styles.logoContainer}>
          {title ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <Text style={styles.logo}>SONIA HOU</Text>
          )}
        </View>

        {/* Right - Cart */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Ionicons name="cart-outline" size={24} color={Colors.primary} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  banner: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
  },
  bannerText: {
    color: Colors.secondary,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    height: 56,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    letterSpacing: 1,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.secondary,
    fontSize: 10,
    fontWeight: FontWeight.bold,
  },
});
