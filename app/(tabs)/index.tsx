import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import CustomHeader from '@/components/CustomHeader';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { categories, getBestSellers } from '@/data/products';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 2 - Spacing.sm) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const bestSellers = getBestSellers();

  const handleShopNow = () => {
    router.push('/(tabs)/shop');
  };

  return (
    <View style={styles.container}>
      <CustomHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80' }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          >
            <Text style={styles.heroText}>
              {"MEET THE WORLD'S FIRST\nCULTURALLY-INCLUSIVE,\nMODERN JEWELRY BRAND"}
            </Text>
            <TouchableOpacity
              style={styles.shopNowButton}
              onPress={handleShopNow}
              activeOpacity={0.9}
            >
              <Text style={styles.shopNowText}>SHOP NOW</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Shop by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SHOP BY CATEGORY</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </ScrollView>
        </View>

        {/* Best Sellers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BEST SELLERS</Text>
          <View style={styles.productGrid}>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} width={CARD_WIDTH} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  // Hero Section
  heroSection: {
    width: SCREEN_WIDTH,
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  heroText: {
    color: Colors.secondary,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  shopNowButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
  },
  shopNowText: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  // Sections
  section: {
    paddingTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: Spacing.lg,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.md,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
});
