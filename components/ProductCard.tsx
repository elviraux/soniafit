import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';

interface ProductCardProps {
  product: Product;
  width?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = Spacing.sm;
const DEFAULT_CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 2 - CARD_MARGIN) / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ProductCard({ product, width = DEFAULT_CARD_WIDTH }: ProductCardProps) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist } = useApp();
  const isWishlisted = isInWishlist(product.id);

  const heartScale = useSharedValue(1);

  const handleWishlistPress = () => {
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
    toggleWishlist(product.id);
  };

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handlePress = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id },
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <AnimatedPressable
          style={[styles.heartButton, heartAnimatedStyle]}
          onPress={handleWishlistPress}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={isWishlisted ? Colors.error : Colors.primary}
          />
        </AnimatedPressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  imageContainer: {
    aspectRatio: 1,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    paddingTop: Spacing.sm,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.text,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
});
