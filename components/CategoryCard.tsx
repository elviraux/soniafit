import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';
import { CategoryItem } from '@/types';

interface CategoryCardProps {
  category: CategoryItem;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/shop',
      params: { category: category.id },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: category.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: Spacing.sm,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
