import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { getProductById } from '@/data/products';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View style={styles.accordion}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.text}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart, isInWishlist, toggleWishlist } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const product = getProductById(id || '');
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const heartScale = useSharedValue(1);

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  if (!product) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart.`);
  };

  const handleWishlistPress = () => {
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
    toggleWishlist(product.id);
  };

  const installmentPrice = (product.price / 4).toFixed(2);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerLogo}>SONIA HOU</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/(tabs)/cart')}
        >
          <Ionicons name="bag-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item }}
                  style={styles.productImage}
                  contentFit="cover"
                />
              </View>
            )}
          />
          {/* Navigation Arrows */}
          {activeImageIndex > 0 && (
            <TouchableOpacity
              style={[styles.carouselArrow, styles.leftArrow]}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index: activeImageIndex - 1,
                  animated: true,
                });
              }}
            >
              <Ionicons name="chevron-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
          {activeImageIndex < product.images.length - 1 && (
            <TouchableOpacity
              style={[styles.carouselArrow, styles.rightArrow]}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index: activeImageIndex + 1,
                  animated: true,
                });
              }}
            >
              <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )}
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          <Text style={styles.installmentText}>
            or 4 interest-free payments of ${installmentPrice} with{' '}
            <Text style={styles.afterpayText}>Afterpay</Text>
          </Text>

          {/* Quantity and Add to Cart */}
          <View style={styles.actionsContainer}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              activeOpacity={0.9}
            >
              <Text style={styles.addToCartText}>ADD TO CART</Text>
            </TouchableOpacity>
          </View>

          {/* Wishlist Button */}
          <TouchableOpacity
            style={styles.wishlistRow}
            onPress={handleWishlistPress}
          >
            <Animated.View style={heartAnimatedStyle}>
              <Ionicons
                name={isWishlisted ? 'heart' : 'heart-outline'}
                size={22}
                color={isWishlisted ? Colors.error : Colors.text}
              />
            </Animated.View>
            <Text style={styles.wishlistText}>
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Text>
          </TouchableOpacity>

          {/* Accordions */}
          <View style={styles.accordionsContainer}>
            <Accordion title="DESCRIPTION" defaultOpen>
              <Text style={styles.accordionText}>{product.description}</Text>
            </Accordion>
            <Accordion title="MATERIALS & CARE">
              <Text style={styles.accordionText}>{product.materials}</Text>
              <Text style={[styles.accordionText, { marginTop: Spacing.sm }]}>
                {product.care}
              </Text>
            </Accordion>
            <Accordion title="REVIEWS">
              {product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>{review.author}</Text>
                      <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name={star <= review.rating ? 'star' : 'star-outline'}
                            size={14}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewComment}>{review.comment}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.accordionText}>No reviews yet.</Text>
              )}
            </Accordion>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Add to Cart */}
      <View
        style={[
          styles.stickyFooter,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.md },
        ]}
      >
        <TouchableOpacity
          style={styles.stickyAddToCart}
          onPress={handleAddToCart}
          activeOpacity={0.9}
        >
          <Text style={styles.stickyAddToCartText}>ADD TO CART - ${(product.price * quantity).toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  backButtonText: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  carouselContainer: {
    position: 'relative',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  carouselArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftArrow: {
    left: Spacing.sm,
  },
  rightArrow: {
    right: Spacing.sm,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
  },
  infoContainer: {
    padding: Spacing.md,
  },
  productName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    lineHeight: 28,
  },
  productPrice: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  installmentText: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  afterpayText: {
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  quantityButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    minWidth: 32,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  addToCartText: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  wishlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  wishlistText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  accordionsContainer: {
    marginTop: Spacing.lg,
  },
  accordion: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  accordionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: 1,
  },
  accordionContent: {
    paddingBottom: Spacing.md,
  },
  accordionText: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    lineHeight: 20,
  },
  reviewItem: {
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  reviewAuthor: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  stickyAddToCart: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  stickyAddToCartText: {
    color: Colors.secondary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
});
