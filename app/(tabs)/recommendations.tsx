// Sport/app/(tabs)/recommendations.tsx
import React, { useState, useCallback, useEffect } from 'react'; // Eliminado useContext ya que usaremos useAuth
import {
    View, Text, Button, StyleSheet, ActivityIndicator,
    FlatList, Image, TouchableOpacity, RefreshControl, Platform
} from 'react-native';
import { useFocusEffect, useRouter, Link } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext'; // Ruta corregida y usando el hook
import api from '../../src/services/api';

// ... (definiciones de API_BASE_URL, API_BASE_URL_IMAGES, Product, RecommendationItem como antes)
// Definición de la IP de tu backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.103:5000'; // O tu IP por defecto
const API_BASE_URL_IMAGES = `${API_BASE_URL}`;

interface Product {
    product_id: number;
    name: string;
    description: string;
    image_url: string;
}

interface RecommendationItem {
    product_details: Product;
    reasoning: string;
}


const RecommendationScreen = () => {
    const router = useRouter();
    const { userToken, userInfo, isLoading: authIsLoading } = useAuth(); // Usando el hook useAuth y desestructurando

    const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
    const [loading, setLoading] = useState(false); // Loading para las recomendaciones
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecommendations = useCallback(async (isRefresh = false) => {
        if (authIsLoading) { // Esperar a que termine la carga inicial del AuthContext
            // Opcionalmente, podrías poner un estado de carga aquí también si lo prefieres
            console.log("Auth context está cargando, esperando para fetchRecommendations...");
            return;
        }

        if (!userToken) {
            setError("Debes iniciar sesión para obtener recomendaciones.");
            // Opcional: Redirigir al login si no hay token
            // router.replace('/login'); // Asegúrate que esta ruta de login exista
            if (!isRefresh) setLoading(false); else setRefreshing(false);
            return;
        }

        // Si userInfo es null, podría indicar que el perfil no está completo
        // El backend ya debería manejar el caso donde el user_profile no existe
        // y devolver un mensaje apropiado que `setError` capturará.

        if (!isRefresh) setLoading(true); else setRefreshing(true);
        setError(null);
        // setRecommendations([]); // Considera si quieres limpiar mientras recarga

        try {
            console.log("Fetching recommendations. API URL:", API_BASE_URL);
            // No es necesario pasar el userInfo en el body, el backend lo obtiene del user_id en el token
            const response = await api.post('/recommendations', {} /* No necesitas enviar el perfil en el body, ya que se obtiene del user_id del token */);

            if (response.data && response.data.recommendations && Array.isArray(response.data.recommendations)) {
                setRecommendations(response.data.recommendations);
                if (response.data.recommendations.length === 0 && response.data.message) {
                    setError(response.data.message);
                } else if (response.data.recommendations.length === 0) {
                    setError("No hay recomendaciones disponibles. Intenta ajustar tu perfil o vuelve más tarde.");
                }
            } else if (response.data && response.data.message) {
                setError(response.data.message);
                setRecommendations([]);
            } else {
                setError("No se pudo obtener el formato de recomendaciones esperado.");
                setRecommendations([]);
            }
        } catch (err: any) {
            // ... (mismo manejo de error que antes, asegúrate que esté robusto)
            let errorMessage = "Error al obtener recomendaciones.";
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
                 errorMessage = `Error de red. Verifica tu conexión y que el servidor (${API_BASE_URL}) esté accesible.`
            }
            console.error("Error en fetchRecommendations:", errorMessage, err);
            setError(errorMessage);
            setRecommendations([]);
        } finally {
            if (!isRefresh) setLoading(false); else setRefreshing(false);
        }
    }, [userToken, userInfo, authIsLoading, API_BASE_URL]); // Incluir authIsLoading y API_BASE_URL

    // Efecto para llamar a fetchRecommendations cuando cambie el token o la info del usuario,
    // y una vez que authIsLoading sea false.
    useEffect(() => {
        if (!authIsLoading) { // Solo ejecutar si la autenticación inicial ha terminado
            // fetchRecommendations(); // Quieres cargar automáticamente al entrar o al cambiar el usuario?
            // Si el usuario completa el perfil en otra pantalla y vuelve aquí,
            // userInfo podría cambiar, lo que activaría este efecto si está en las dependencias.
        }
    }, [authIsLoading, userToken, userInfo, fetchRecommendations]); // Dependencias actualizadas

    useFocusEffect(
        useCallback(() => {
            if (!authIsLoading) { // Solo si la carga de auth ha terminado
                 // Podrías descomentar para refrescar al enfocar:
                 // console.log("RecommendationScreen enfocado, userToken:", userToken ? "Sí" : "No");
                 // if (userToken) { // Solo si hay token, intenta cargar/refrescar
                 //   fetchRecommendations();
                 // }
            }
            return () => { /* Limpieza */ };
        }, [authIsLoading, userToken, fetchRecommendations])
    );


    if (authIsLoading) { // Mostrar un loader global mientras AuthContext se inicializa
        return (
            <View style={[styles.container, styles.centeredMessageContainer]}>
                <ActivityIndicator size="large" color="#F8D930" />
                <Text style={{ color: '#F8D930', marginTop: 10 }}>Cargando sesión...</Text>
            </View>
        );
    }

    // ... (el resto del JSX para renderizar el botón, la lista, los errores, etc., es igual)
    // Asegúrate que `styles` esté definido correctamente al final del archivo.
    // renderItem y renderEmptyOrError deben estar aquí.

    const renderItem = ({ item }: { item: RecommendationItem }) => {
        const product = item.product_details;
        if (!product) return null;

        const imageUrl = product.image_url
            ? `${API_BASE_URL_IMAGES}/images/products/${product.image_url}`
            : 'https://via.placeholder.com/100?text=No+Image';

        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => {
                    // console.log("Navegar a producto:", product.product_id);
                    // if (product.product_id) router.push(`/products/${product.product_id}`);
                }}
            >
                <Image source={{ uri: imageUrl }} style={styles.productImage} onError={(e) => console.log(`Error img: ${imageUrl}`)} />
                <View style={styles.infoContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
                    {item.reasoning && (
                        <View style={styles.reasoningContainer}>
                            <Text style={styles.reasoningTitle}>Sugerencia para ti:</Text>
                            <Text style={styles.reasoningText}>{item.reasoning}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmptyOrError = () => {
        // Mismo que antes... solo verifica si 'error' y 'loading' (no authIsLoading) y 'recommendations'
        if (error && !loading) { // No mostrar error si está cargando nuevas recomendaciones
            let actionButton = null;
            if (error.toLowerCase().includes("perfil") || error.toLowerCase().includes("profile")) {
                actionButton = (
                    <Link href="/(tabs)/profile" asChild> 
                        <Button title="Completar mi Perfil" color="tomato" />
                    </Link>
                );
            }
            return (
                <View style={styles.centeredMessageContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    {actionButton}
                </View>
            );
        }
        if (!loading && recommendations.length === 0) { // No authIsLoading aquí, sino 'loading' de las recomendaciones
            return (
                <View style={styles.centeredMessageContainer}>
                    <Text style={styles.emptyText}>
                        Presiona "Obtener Recomendaciones" para empezar.
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
                    title={(loading && !refreshing) ? "Buscando..." : "Obtener Recomendaciones"}
                    onPress={() => fetchRecommendations(false)}
                    disabled={loading || refreshing || authIsLoading} // Deshabilitar también si auth está cargando
                    color="#F8D930"
                />
            </View>

            {loading && !refreshing && <ActivityIndicator size="large" color="#F8D930" style={styles.loader} />}

            {(!loading || refreshing) && !authIsLoading ? ( // Solo renderiza FlatList si no está en la carga de auth y (no está en la carga inicial O está refrescando)
                <FlatList
                    data={recommendations}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.product_details?.product_id?.toString() || Math.random().toString()}
                    ListEmptyComponent={!loading ? renderEmptyOrError : null} 
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchRecommendations(true)}
                            colors={["#F8D930"]}
                            tintColor={"#F8D930"}
                        />
                    }
                />
            ) : null}
             {loading && !refreshing && error && ( // Error específico durante carga
                <View style={styles.centeredMessageContainer}><Text style={styles.errorText}>{error}</Text></View>
            )}
        </View>
    );

};


// ... (Los mismos estilos que te proporcioné antes, asegúrate que estén aquí)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c2c2c',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 25 : 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        backgroundColor: '#1a1a19',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#F8D930',
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
        color: '#ccc',
    },
    itemContainer: {
        backgroundColor: '#3a3a3a',
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#555',
        borderWidth: 1,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 15,
        resizeMode: 'contain',
        backgroundColor: '#555'
    },
    infoContainer: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F0F0F0',
    },
    productDescription: {
        fontSize: 13,
        color: '#bbb',
        marginTop: 4,
        marginBottom: 8,
    },
    reasoningContainer: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#4f4b31',
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#F8D930',
    },
    reasoningTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#F8D930',
        marginBottom: 3,
    },
    reasoningText: {
        fontSize: 12,
        color: '#E0E0E0',
    },
});

export default RecommendationScreen;