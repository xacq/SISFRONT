import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { getProductDetails, getProductNutrition, getProductFlavors, getProductAttributes } from '../services/api';
import { RouteProp } from '@react-navigation/native';


type ProductDetailScreenRouteProp = RouteProp<{ params: { productId: string } }, 'params'>;

const ProductDetailScreen = ({ route }: { route: ProductDetailScreenRouteProp }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [flavors, setFlavors] = useState([]);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        // Cargar datos principales del producto
        const productData = await getProductDetails(productId);
        setProduct(productData);
        
        // Cargar información nutricional
        const nutritionData = await getProductNutrition(productId);
        setNutrition(nutritionData);
        
        // Cargar sabores disponibles
        const flavorsData = await getProductFlavors(productId);
        setFlavors(flavorsData);
        
        // Cargar atributos del producto
        const attributesData = await getProductAttributes(productId);
        setAttributes(attributesData);
      } catch (error) {
        console.error('Error loading product details:', error);
      }
    };

    loadProductData();
  }, [productId]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando información del producto...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: product.image_url || 'https://via.placeholder.com/300' }} 
        style={styles.productImage}
      />
      
      <View style={styles.section}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recomendaciones de Uso</Text>
        <Text style={styles.sectionContent}>{product.usage_recommendation}</Text>
      </View>

      {flavors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sabores Disponibles</Text>
          <View style={styles.flavorContainer}>
            {flavors.map(flavor => (
              <Text key={flavor.flavor_id} style={styles.flavorText}>
                • {flavor.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {nutrition && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Nutricional</Text>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Tamaño de porción:</Text>
            <Text style={styles.nutritionValue}>{nutrition.serving_size}</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Energía (kcal):</Text>
            <Text style={styles.nutritionValue}>{nutrition.energy_kcal}</Text>
          </View>
          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Proteínas (g):</Text>
            <Text style={styles.nutritionValue}>{nutrition.protein_g}</Text>
          </View>
          {/* Agrega más filas nutricionales según necesites */}
        </View>
      )}

      {attributes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beneficios y Características</Text>
          {attributes.map(attr => (
            <View key={attr.attribute_id} style={styles.attributeItem}>
              <Text style={styles.attributeName}>{attr.name}</Text>
              <Text style={styles.attributeDescription}>{attr.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1919',
    padding: 15,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  productName: {
    color: '#F8D930',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productDescription: {
    color: 'lightgray',
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    color: '#F8D930',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8D930',
    paddingBottom: 5,
  },
  sectionContent: {
    color: 'lightgray',
    fontSize: 16,
    lineHeight: 24,
  },
  flavorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flavorText: {
    color: 'white',
    marginRight: 15,
    marginBottom: 5,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  nutritionLabel: {
    color: 'lightgray',
    fontSize: 16,
  },
  nutritionValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  attributeItem: {
    marginBottom: 15,
  },
  attributeName: {
    color: '#F8D930',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  attributeDescription: {
    color: 'lightgray',
    fontSize: 16,
    lineHeight: 22,
  },
});

export default ProductDetailScreen;