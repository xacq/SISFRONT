import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getProductCategories, getProductsByCategory } from '../../src/services/api';
import { getProductImageSource } from '../../src/utils/imageUtils';
import { useRouter } from 'expo-router';


interface Product {
  product_id: number;
  name: string;
  description: string;
  image_url: string;

  // otros campos necesarios...
}

interface Category {
  category_id: number;
  name: string;
   // otros campos necesarios...
}


const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]); // Añadir tipo
  const [categories, setCategories] = useState<Category[]>([]); // Añadir tipo
  const router = useRouter(); // <-- USA useRouter
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); 

  useEffect(() => {
    // Cargar categorías y productos iniciales
    const loadData = async () => {
      try {
        const categoriesResponse = await getProductCategories();
        setCategories(categoriesResponse);
        
        if (categoriesResponse.length > 0) {
          setSelectedCategory(categoriesResponse[0].category_id);
          const productsResponse = await getProductsByCategory(categoriesResponse[0].category_id.toString());
          setProducts(productsResponse);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleCategoryChange = async (categoryId: number) => {
    try {
      setSelectedCategory(categoryId);
      const productsResponse = await getProductsByCategory(categoryId.toString());
      setProducts(productsResponse);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => ( // <-- Añadir tipo Product aquí
    <TouchableOpacity
      style={styles.productItem}
      // CAMBIA la navegación para usar router.push con el PATH
      onPress={() => router.push(`/products/${item.product_id}`)}
    >
      <Image
        source={getProductImageSource(item.image_url)}
        style={styles.productImage}
        resizeMode="contain"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <View style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.category_id}
            style={[
              styles.categoryButton,
              selectedCategory === category.category_id && styles.selectedCategory
            ]}
            onPress={() => handleCategoryChange(category.category_id)}
          >
            <Text style={styles.categoryText}>{category.name.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.product_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1919',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    backgroundColor: '#2a2a2a',
  },
  categoryButton: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#3a3a3a',
  },
  selectedCategory: {
    backgroundColor: '#F8D930',
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
  },
  listContainer: {
    padding: 10,
  },
  productItem: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    color: '#F8D930',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDescription: {
    color: 'lightgray',
    fontSize: 14,
  },
});

export default ProductListScreen;