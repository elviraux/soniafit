import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { CartItem } from '@/types';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id: item.product.id },
    });
  };

  return (
    <View style={styles.cartItem}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Image
          source={{ uri: item.product.images[0] }}
          style={styles.itemImage}
          contentFit="cover"
        />
      </TouchableOpacity>
      <View style={styles.itemInfo}>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.product.name}
          </Text>
        </TouchableOpacity>
        <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity - 1)}
          >
            <Ionicons name="remove" size={18} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Ionicons name="add" size={18} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={20} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { cartItems, updateCartQuantity, removeFromCart, getCartTotal, clearCart } = useApp();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart is empty', 'Add some items to your cart first!');
      return;
    }
    Alert.alert(
      'Checkout',
      `Your order total is $${total.toFixed(2)}. This is a demo app.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete Order',
          onPress: () => {
            clearCart();
            Alert.alert('Order Placed!', 'Thank you for your purchase.');
          },
        },
      ]
    );
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert(
      'Remove Item',
      `Remove "${productName}" from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SHOPPING BAG</Text>
        <Text style={styles.itemCount}>
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {cartItems.length > 0 ? (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onUpdateQuantity={(qty) => updateCartQuantity(item.product.id, qty)}
                onRemove={() => handleRemoveItem(item.product.id, item.product.name)}
              />
            ))}

            {/* Order Summary */}
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </View>
              {shipping > 0 && (
                <Text style={styles.freeShippingNote}>
                  Add ${(50 - subtotal).toFixed(2)} more for FREE shipping
                </Text>
              )}
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Checkout Button */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
              activeOpacity={0.9}
            >
              <Text style={styles.checkoutText}>CHECKOUT</Text>
            </TouchableOpacity>
            <Text style={styles.afterpayText}>
              or 4 interest-free payments with Afterpay
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Text style={styles.emptySubtitle}>
            Browse our collection and add items to your bag
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)/shop')}
          >
            <Text style={styles.shopButtonText}>SHOP NOW</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    letterSpacing: 1.5,
  },
  itemCount: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.borderLight,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: Spacing.xs,
  },
  summary: {
    padding: Spacing.md,
    marginTop: Spacing.md,
    backgroundColor: Colors.borderLight,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  summaryValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  freeShippingNote: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  totalValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  checkoutText: {
    color: Colors.secondary,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  afterpayText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  shopButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.lg,
  },
  shopButtonText: {
    color: Colors.secondary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
});
