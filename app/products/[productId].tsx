import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { getProductDetails, getProductNutrition, getProductFlavors, getProductAttributes } from '../../src/services/api';
// 1. ELIMINA estas importaciones de React Navigation
// import { RouteProp } from '@react-navigation/native';
import { getProductImageSource } from '../../src/utils/imageUtils'; // <- Verifica la ruta si moviste utils a src/
// 2. IMPORTA useLocalSearchParams de Expo Router
import { useLocalSearchParams, Stack } from 'expo-router'; // <-- AÑADE useLocalSearchParams y Stack

// 3. ELIMINA la definición de tipo de ruta de React Navigation
// type ProductDetailScreenRouteProp = RouteProp<{ params: { productId: string } }, 'params'>;

// Define los tipos para tus datos (puedes moverlos a src/types)
interface Product {
  image_url: string;
  name: string;
  description: string;
  usage_recommendation: string;
  // Agrega otros campos si getProductDetails los devuelve
}
interface NutritionInfo {
  serving_size: string;
  energy_kcal: number;
  protein_g: number;
  // Agrega otros campos si getProductNutrition los devuelve
}
interface Flavor {
  flavor_id: string | number; // Ajusta el tipo si es necesario
  name: string;
}
interface Attribute {
  attribute_id: string | number; // Ajusta el tipo si es necesario
  name: string;
  description: string | null; // Permite que sea null
}

// 4. CAMBIA la definición del componente: ya no recibe `route` como prop
const ProductDetailScreen = () => {
  // 5. USA useLocalSearchParams para obtener el parámetro
  //    Define el tipo esperado para asegurar que productId sea string
  const params = useLocalSearchParams<{ productId: string }>();
  const { productId } = params; // <-- productId será string o undefined

  // Define tus estados como antes, usando los tipos definidos arriba
  const [product, setProduct] = useState<Product | null>(null);
  const [nutrition, setNutrition] = useState<NutritionInfo | null>(null);
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  useEffect(() => {
    // 6. Asegúrate de que productId existe antes de usarlo
    if (productId) {
      const loadProductData = async () => {
        // 7. Convierte productId a número para usar en la API (si es necesario)
        const numericProductId = parseInt(productId, 10);
        if (isNaN(numericProductId)) {
           console.error('Invalid Product ID:', productId);
           setError('ID de producto inválido.');
           setLoading(false);
           return;
        }

        setLoading(true); // Empieza la carga
        setError(null);    // Resetea errores

        try {
          // Carga todo en paralelo para mejorar rendimiento (opcional)
          const [
            productData,
            nutritionData,
            flavorsData,
            attributesData,
          ] = await Promise.all([
            getProductDetails(numericProductId.toString()),
            getProductNutrition(numericProductId.toString()),
            getProductFlavors(numericProductId.toString()),
            getProductAttributes(numericProductId.toString()),
          ]);

          setProduct(productData);
          setNutrition(nutritionData);
          setFlavors(flavorsData);
          setAttributes(attributesData);
        } catch (err: any) { // Captura específica del error
          console.error('Error loading product details:', err);
          // Muestra un mensaje más útil, si el error tiene estructura
          setError(err.message || 'Error al cargar la información del producto.');
        } finally {
          setLoading(false); // Termina la carga (éxito o fallo)
        }
      };
      loadProductData();
    } else {
      // Manejo caso donde productId no está presente (no debería ocurrir con router.push)
      console.error('Product ID is missing');
      setError('No se proporcionó ID de producto.');
      setLoading(false);
    }
  // 8. Dependencia del useEffect es productId
  }, [productId]);

  // 9. Muestra estados de Carga y Error
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando información del producto...</Text>
      </View>
    );
  }

  if (error) {
     return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Si no hay producto después de cargar (y sin error), muestra mensaje
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>No se encontró información del producto.</Text>
      </View>
    );
  }

  // --- JSX para mostrar la información (tu código actual es bueno) ---
  return (
    <>
      {/* 10. Configura opciones de la pantalla (opcional, si quieres título dinámico) */}
      <Stack.Screen options={{ title: product?.name || 'Detalles' }} />
      <ScrollView style={styles.container}>
        <Image
                source={getProductImageSource(product.image_url)}
                style={styles.productImage}
                resizeMode="contain"
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
              // 11. MANEJO DE DESCRIPCIÓN NULL (Buena práctica)
              attr.description ? ( // Solo muestra si hay descripción
                <View key={attr.attribute_id} style={styles.attributeItem}>
                    <Text style={styles.attributeName}>{attr.name}</Text>
                    <Text style={styles.attributeDescription}>{attr.description}</Text>
                </View>
               ) : ( // O muestra solo el nombre si no hay descripción
                 <Text key={attr.attribute_id} style={[styles.attributeName, styles.attributeItem]}>
                   {attr.name}
                 </Text>
               )
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
};

// Añade estilo para el texto de error
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
   errorText: { // Estilo para mensaje de error
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
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
    fontSize: 16 // Un poco más grande para legibilidad
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