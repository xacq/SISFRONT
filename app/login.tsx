import React, { useState } from 'react';
import { View, Image, Alert, StyleSheet } from 'react-native';
import AuthForm from '../src/components/AuthForm';   // <-- VERIFICA RUTA
import CustomButton from '../src/components/CustomButton'; // <-- VERIFICA RUTA
import { loginUser } from '../src/services/api';       // <-- VERIFICA RUTA
// 1. ELIMINA NavigationProp
// import { NavigationProp } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext'; // <-- IMPORTA useAuth

// 2. El componente ya no recibe 'navigation'
const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth(); // <-- OBTÉN la función login del contexto
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validaciones básicas (¡considera añadir validación de formato de email!)
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      // Llama a la API para autenticar
      const userData = await loginUser(email, password); // Asume que loginUser devuelve los datos del usuario en caso de éxito o lanza error

      // ----------------------------------------------------------
      // 3. MANEJO DE ÉXITO: Llama a la función del AuthContext
      // ----------------------------------------------------------
      console.log('Login successful, calling context login:', userData); // Log para depurar
      login(userData.token, userData.user); // ✅ Correcto
      // NO NAVEGUES DESDE AQUÍ. El _layout.tsx se encargará de redirigir
      // al detectar el cambio en el 'user' del contexto.
      // ----------------------------------------------------------

    } catch (error: any) { // Especifica 'any' o un tipo de error más específico
      console.error('Login failed:', error); // Log completo del error

      const errorResponse = error.response; // Acceso seguro a 'response'
      let errorMessage = 'Ocurrió un error inesperado durante el inicio de sesión.';

      if (errorResponse) {
          // Si hay una respuesta del servidor
          if (errorResponse.status === 401) {
            errorMessage = 'Usuario o contraseña incorrectos.';
          } else if (errorResponse.data?.message) {
            errorMessage = errorResponse.data.message; // Usa el mensaje del backend si existe
          }
      } else if (error.request) {
          // Si la petición se hizo pero no hubo respuesta (problema de red?)
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
      } else {
          // Otro tipo de error (configuración, etc.)
          errorMessage = error.message || errorMessage;
      }

      Alert.alert('Error de Inicio de Sesión', errorMessage);
      
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/login.png')} // <-- VERIFICA RUTA (relativa a app/login.tsx ahora?)
        style={styles.logo}
        resizeMode="contain"
      />
      <AuthForm
        fields={[
          { label: 'Correo Electrónico', value: email, onChangeText: setEmail, keyboardType: 'email-address', autoCapitalize: 'none' }, // Buenas prácticas
          { label: 'Contraseña', value: password, onChangeText: setPassword, secure: true }
        ]}
      />
      <CustomButton
        title="INGRESAR"
        iconColor='#1a1919'
        iconName='log-in-outline' // Un icono más apropiado? (requiere ionicons si usas eso)
        iconPosition='right'
        iconSize={24}
        onPress={handleLogin}
        style={styles.button}
      />
      <CustomButton
        title="REGISTRARSE"
        iconColor='#1a1919'
        iconName='person-add-outline'
        iconPosition='right'
        iconSize={24}
        // 4. CAMBIA navegación a Registro usando router.push y el PATH
        onPress={() => router.push('/register')} // Asume que register.tsx está en app/
        style={styles.buttonregister}
      />
    </View>
  );
};

// ... (estilos igual, pero revisa si hay cambios por nueva ubicación de componentes)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1919',
  },
  logo: {
    height: 110,
    marginTop: -100, // Ajusta según sea necesario
    marginBottom: 40, // Espacio antes del formulario
  },
  button: {
    width: '80%',
    backgroundColor: '#F8D930',
    marginTop: 20, // Espacio después del formulario
  },
  buttonregister: {
    width: '80%',
    backgroundColor: '#F8D930', // Quizás otro color para distinguir?
    marginTop: 15,
  },
});

export default LoginScreen;