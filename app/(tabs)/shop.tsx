import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/CustomHeader';
import ProductCard from '@/components/ProductCard';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { products, getProductsByCategory, categories } from '@/data/products';
import { Product } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 2 - Spacing.sm) / 2;

// Filter option types
type PriceRange = 'under50' | '50to100' | '100to200' | 'over200' | null;
type MaterialFilter = 'gold' | 'silver' | 'diamond' | null;

const PRICE_RANGES: { id: PriceRange; label: string; min: number; max: number }[] = [
  { id: 'under50', label: 'Under $50', min: 0, max: 50 },
  { id: '50to100', label: '$50 - $100', min: 50, max: 100 },
  { id: '100to200', label: '$100 - $200', min: 100, max: 200 },
  { id: 'over200', label: '$200+', min: 200, max: Infinity },
];

const MATERIAL_FILTERS: { id: MaterialFilter; label: string; keywords: string[] }[] = [
  { id: 'gold', label: 'Gold', keywords: ['Gold'] },
  { id: 'silver', label: 'Silver', keywords: ['Silver', 'Sterling'] },
  { id: 'diamond', label: 'Diamond / Crystal', keywords: ['Diamond', 'Crystal', 'Cubic Zirconia'] },
];

export default function ShopScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayProducts, setDisplayProducts] = useState<Product[]>(products);
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high'>('default');

  // Filter states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialFilter>(null);

  // Temporary filter states (for modal)
  const [tempPriceRange, setTempPriceRange] = useState<PriceRange>(null);
  const [tempMaterial, setTempMaterial] = useState<MaterialFilter>(null);

  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category);
    }
  }, [params.category]);

  useEffect(() => {
    let filtered = selectedCategory
      ? getProductsByCategory(selectedCategory)
      : products;

    // Apply price filter
    if (selectedPriceRange) {
      const range = PRICE_RANGES.find(r => r.id === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(p => p.price >= range.min && p.price < range.max);
      }
    }

    // Apply material filter
    if (selectedMaterial) {
      const material = MATERIAL_FILTERS.find(m => m.id === selectedMaterial);
      if (material) {
        filtered = filtered.filter(p =>
          material.keywords.some(keyword =>
            p.materials.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      }
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    setDisplayProducts(filtered);
  }, [selectedCategory, sortBy, selectedPriceRange, selectedMaterial]);

  const getTitle = () => {
    if (selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory);
      return cat?.name || 'SHOP';
    }
    return 'BEST SELLERS';
  };

  const openFilterModal = () => {
    // Initialize temp states with current filter values
    setTempPriceRange(selectedPriceRange);
    setTempMaterial(selectedMaterial);
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  const applyFilters = () => {
    setSelectedPriceRange(tempPriceRange);
    setSelectedMaterial(tempMaterial);
    setFilterModalVisible(false);
  };

  const resetFilters = () => {
    setTempPriceRange(null);
    setTempMaterial(null);
  };

  const hasActiveFilters = selectedPriceRange !== null || selectedMaterial !== null;

  return (
    <View style={styles.container}>
      <CustomHeader title={getTitle()} />

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
          <Ionicons name="options-outline" size={18} color={Colors.text} />
          <Text style={styles.filterText}>
            Filter{hasActiveFilters ? ' (Active)' : ''}
          </Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setSortBy(prev => {
              if (prev === 'default') return 'price-low';
              if (prev === 'price-low') return 'price-high';
              return 'default';
            });
          }}
        >
          <Ionicons name="swap-vertical-outline" size={18} color={Colors.text} />
          <Text style={styles.filterText}>
            Sort by{sortBy !== 'default' ? ` (${sortBy === 'price-low' ? 'Low' : 'High'})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollView}
        contentContainerStyle={styles.categoryPills}
      >
        <TouchableOpacity
          style={[
            styles.categoryPill,
            !selectedCategory && styles.categoryPillActive,
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryPillText,
              !selectedCategory && styles.categoryPillTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryPill,
              selectedCategory === cat.id && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[
                styles.categoryPillText,
                selectedCategory === cat.id && styles.categoryPillTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {displayProducts.length > 0 ? (
          <View style={styles.productGrid}>
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} width={CARD_WIDTH} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeFilterModal}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeFilterModal}>
              <Ionicons name="close" size={28} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>FILTERS</Text>
            <View style={styles.modalCloseButton} />
          </View>

          {/* Filter Content */}
          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={styles.modalContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Price Range Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>PRICE RANGE</Text>
              <View style={styles.filterOptions}>
                {PRICE_RANGES.map((range) => (
                  <TouchableOpacity
                    key={range.id}
                    style={[
                      styles.filterOption,
                      tempPriceRange === range.id && styles.filterOptionActive,
                    ]}
                    onPress={() => setTempPriceRange(
                      tempPriceRange === range.id ? null : range.id
                    )}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempPriceRange === range.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Material Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>MATERIAL</Text>
              <View style={styles.filterOptions}>
                {MATERIAL_FILTERS.map((material) => (
                  <TouchableOpacity
                    key={material.id}
                    style={[
                      styles.filterOption,
                      tempMaterial === material.id && styles.filterOptionActive,
                    ]}
                    onPress={() => setTempMaterial(
                      tempMaterial === material.id ? null : material.id
                    )}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        tempMaterial === material.id && styles.filterOptionTextActive,
                      ]}
                    >
                      {material.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={[styles.modalActions, { paddingBottom: insets.bottom + Spacing.md }]}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.xs,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  categoryScrollView: {
    flexGrow: 0,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoryPills: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryPill: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryPillText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  categoryPillTextActive: {
    color: Colors.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.xxl * 2,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    height: 56,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    paddingVertical: Spacing.lg,
  },
  filterSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  filterSectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  filterOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  filterOptionTextActive: {
    color: Colors.secondary,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  applyButton: {
    flex: 2,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.secondary,
    letterSpacing: 0.5,
  },
});
