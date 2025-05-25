// Sport/app/(tabs)/recommendations.js
import React, { useState, useContext, useCallback } from 'react';
import {
    View, Text, Button, StyleSheet, ActivityIndicator,
    FlatList, Image, ScrollView, TouchableOpacity, RefreshControl
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router'; // Importar useRouter de expo-router
import { AuthContext } from '../../context/AuthContext'; // Ajustar ruta si es necesario
import api from '../../services/api'; // Ajustar ruta si es necesario

// Asegúrate que la URL base de tu API sea correcta, especialmente para imágenes
const API_BASE_URL_IMAGES = 'http://TU_IP_DE_DESARROLLO_O_DOMINIO:5000'; // Reemplaza con la URL de tu backend

const RecommendationScreen = () => { // No necesita { navigation } como prop con useRouter
    const router = useRouter(); // Hook de Expo Router para navegación
    const { userToken, userInfo } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecommendations = async (isRefresh = false) => {
        if (!userToken) {
            setError("Debes iniciar sesión para obtener recomendaciones.");
            if (!isRefresh) setLoading(false); else setRefreshing(false);
            return;
        }
        if (!isRefresh) setLoading(true);
        setError(null);

        try {
            const response = await api.post('/recommendations', {}, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.data && response.data.recommendations && Array.isArray(response.data.recommendations)) {
                setRecommendations(response.data.recommendations);
                if (response.data.recommendations.length === 0 && response.data.message) {
                    setError(response.data.message);
                } else if (response.data.recommendations.length === 0) {
                    setError("No hay recomendaciones disponibles por el momento. Intenta ajustar tu perfil o vuelve más tarde.");
                }
            } else if (response.data && response.data.message) {
                setError(response.data.message);
                setRecommendations([]);
            }
            else {
                setError("No se pudieron obtener recomendaciones o el formato es incorrecto.");
                setRecommendations([]);
            }
        } catch (err) {
            let errorMessage = "Error al obtener recomendaciones. Intenta más tarde.";
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message.includes('Network Error')) {
                errorMessage = "Error de red. Verifica tu conexión y que el servidor esté accesible."
            }
            setError(errorMessage);
            setRecommendations([]);
        } finally {
            if (!isRefresh) setLoading(false); else setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            // Podrías querer fetch aquí si el perfil pudo haber cambiado
            // fetchRecommendations();
            return () => {};
        }, [userToken])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchRecommendations(true);
    }, [userToken]);

    const renderRecommendationItem = ({ item }) => {
        const product = item.product_details;
        if (!product) return null;

        const imageUrl = product.image_url
            ? `${API_BASE_URL_IMAGES}/images/products/${product.image_url}`
            : 'https://via.placeholder.com/100?text=No+Image';

        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                    console.log("Navegar a detalles de producto ID:", product.product_id);
                    // Para Expo Router, si tienes un archivo app/products/[id].js:
                    // router.push(`/products/${product.product_id}`);
                }}
            >
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.productImage}
                    onError={(e) => console.log(`Error cargando imagen: ${imageUrl}`, e.nativeEvent.error)}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
                    {item.reasoning && (
                        <View style={styles.reasoningContainer}>
                            <Text style={styles.reasoningTitle}>Sugerencia para ti:</Text>
                            <Text style={styles.reasoningText}>{item.reasoningText ? item.reasoningText : item.reasoning /*Asegurar compatibilidad con el nombre del campo*/}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyOrErrorState = () => {
        if (error) {
            let actionButton = null;
            // Asumiendo que tu pantalla de formulario de perfil es 'profileForm' dentro de la pestaña 'profile' o una ruta directa
            // El Tab de perfil actual en tu repo se llama `profile.js` y muestra `ProfileScreen`.
            // `ProfileScreen` luego podría tener un botón o lógica para navegar a `ProfileForm`.
            // Si ProfileForm es una pantalla aparte como por ejemplo `/profile/edit`
            if (error.toLowerCase().includes("perfil")) {
                actionButton = (
                    <Button
                        title="Completar mi Perfil"
                        onPress={() => router.push('/profile/profileForm')} // O '/(tabs)/profile' y desde ahí navegar al form
                        color="tomato"
                    />
                );
            }
            return (
                <View style={styles.centeredMessageContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    {actionButton}
                </View>
            );
        }
        if (!loading && recommendations.length === 0) {
             return (
                <View style={styles.centeredMessageContainer}>
                    <Text style={styles.emptyText}>
                        Aún no hay recomendaciones para ti.
                        {'\n'}Presiona el botón o desliza hacia abajo para buscar.
                    </Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Tus Recomendaciones</Text>
                <Button
                    title={loading ? "Buscando..." : "Obtener Recomendaciones"}
                    onPress={() => fetchRecommendations(false)}
                    disabled={loading || refreshing}
                    color="tomato"
                />
            </View>

            {loading && !refreshing && <ActivityIndicator size="large" color="tomato" style={styles.loader} />}

            {!loading && (recommendations.length > 0 || error) ? (
                 <FlatList
                    data={recommendations}
                    renderItem={renderRecommendationItem}
                    keyExtractor={(item) => item.product_details.product_id.toString()}
                    ListEmptyComponent={renderEmptyOrErrorState}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["tomato"]}
                        />
                    }
                />
            ) : (
                !loading && renderEmptyOrErrorState()
            )}
        </View>
    );
};

// ... (Mismos estilos que antes)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
    },
    loader: {
        marginTop: 50,
    },
    centeredMessageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 10,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
    itemContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center', // Alinea verticalmente la imagen y el texto
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 15,
        resizeMode: 'contain',
        backgroundColor: '#eee' // Un fondo suave mientras carga
    },
    infoContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    productDescription: {
        fontSize: 13,
        color: '#7f8c8d',
        marginTop: 4,
        marginBottom: 8,
    },
    reasoningContainer: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#e9f5ff', // Un color azul claro suave
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#2980b9', // Un azul más suave
    },
    reasoningTitle: {
        fontSize: 13,
        fontWeight: '600', // Semibold
        color: '#1f648f', // Un azul más oscuro para el título
        marginBottom: 3,
    },
    reasoningText: {
        fontSize: 12,
        color: '#34495e', // Un gris oscuro para el texto
    },
});

export default RecommendationScreen;