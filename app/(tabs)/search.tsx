import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProductCard from '@/components/ProductCard';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { products } from '@/data/products';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 2 - Spacing.sm) / 2;

const popularSearches = [
  'Gold earrings',
  'Sterling silver',
  'Hoop earrings',
  'Necklaces',
  'Rings',
  'Bracelets',
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handlePopularSearch = (term: string) => {
    setSearchQuery(term);
    setIsSearching(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jewelry..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setIsSearching(text.length > 0);
            }}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setIsSearching(false);
              }}
            >
              <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isSearching ? (
          <>
            {/* Popular Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>POPULAR SEARCHES</Text>
              <View style={styles.popularContainer}>
                {popularSearches.map((term, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.popularPill}
                    onPress={() => handlePopularSearch(term)}
                  >
                    <Text style={styles.popularText}>{term}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Trending Products */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TRENDING NOW</Text>
              <View style={styles.productGrid}>
                {products.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} width={CARD_WIDTH} />
                ))}
              </View>
            </View>
          </>
        ) : searchResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsCount}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
            </Text>
            <View style={styles.productGrid}>
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} width={CARD_WIDTH} />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>
              Try searching for something else
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  section: {
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: 1.5,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  popularContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  popularPill: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.full,
  },
  popularText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  resultsContainer: {
    paddingTop: Spacing.md,
  },
  resultsCount: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  noResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxl * 2,
  },
  noResultsText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  noResultsSubtext: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
});
