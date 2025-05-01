import React from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView } from 'react-native';
// Opcional: si quieres personalizar el saludo con el nombre del usuario
// import { useAuth } from '../../src/context/AuthContext';

// --- Asegúrate que la ruta a tu logo sea correcta desde este archivo ---
// Ejemplo: si index.tsx está en app/(tabs)/ y tu logo en assets/images/
const logoPath = require('../../assets/images/login.png'); // <-- ¡CAMBIA ESTO POR LA RUTA REAL DE TU LOGO!

const HomeScreen = () => {
  // Opcional: Obtener usuario para saludo personalizado
  // const { user } = useAuth();

  return (
    // SafeAreaView para respetar notches y áreas seguras
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={logoPath}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Tu Asistente de Rendimiento Deportivo</Text>

        <Text style={styles.description}>
          Analizamos la información de tu <Text style={styles.highlight}>Perfil</Text> y las características de nuestros productos para recomendarte la combinación ideal de suplementos.
          Optimiza tu <Text style={styles.highlight}>energía</Text>, <Text style={styles.highlight}>hidratación</Text> y <Text style={styles.highlight}>recuperación</Text> para alcanzar tus metas deportivas.
        </Text>

        <Text style={styles.instructions}>
          Para obtener las mejores recomendaciones, asegúrate de que la información en la pestaña <Text style={styles.highlight}>"Perfil"</Text> esté completa y actualizada.
        </Text>

         {/* Podrías añadir un botón aquí si quisieras una acción específica */}
         {/* <CustomButton title="Ver Productos" onPress={() => router.push('/(tabs)/products')} /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1919', // Fondo oscuro para toda el área segura
  },
  container: {
    flex: 1,
    alignItems: 'center', // Centrar contenido horizontalmente
    justifyContent: 'center', // Centrar contenido verticalmente
    paddingTop:0, // Un poco de espacio abajo
  },
  logo: {
    width: 400, // Ajusta el tamaño según tu logo
    marginBottom: 0, // Espacio debajo del logo
  },
  title: {
    fontSize: 30, // Tamaño prominente
    fontWeight: 'bold',
    color: '#F8D930', // Color de acento
    textAlign: 'center',
    lineHeight: 40, // Espaciado entre líneas para mejor lectura
    paddingHorizontal: 20, // Espacio lateral para evitar que el texto toque los bordes
    textTransform: 'uppercase', // Texto en mayúsculas para mayor impacto
    letterSpacing: 1, // Espaciado entre letras para mayor claridad
    textShadowColor: '#000', // Sombra para destacar el texto
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 5, // Difuminado de la sombra
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para destacar el texto
    borderRadius: 10, // Bordes redondeados para un look moderno
    padding: 10, // Espacio interno para el texto
    overflow: 'hidden', // Para que el fondo no sobresalga
    maxWidth: '90%', // Limitar el ancho máximo para pantallas grandes
  },
  description: {
    fontSize: 18,
    color: 'lightgray', // Texto legible sobre fondo oscuro
    textAlign: 'center',
    lineHeight: 24, // Espaciado entre líneas para mejor lectura
    marginBottom: 20, // Espacio entre párrafos
  },
  highlight: {
    color: '#F8D930', // Resaltar palabras clave
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 12,
    color: '#a0a0a0', // Un gris un poco más tenue
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 30, // Más espacio antes de esta instrucción final
    lineHeight: 20,
  },
});

export default HomeScreen;