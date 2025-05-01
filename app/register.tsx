import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image } from 'react-native';
import AuthForm from '../src/components/AuthForm'; // <-- VERIFICA RUTA
import CustomButton from '../src/components/CustomButton'; // <-- VERIFICA RUTA
import { registerUser } from '../src/services/api'; // <-- VERIFICA RUTA

import { useRouter } from 'expo-router'; // <-- IMPORTA useRouter

// 2. El componente ya no recibe 'navigation'
const RegisterScreen = () => {
  const router = useRouter(); // <-- USA useRouter
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validaciones (están bien)
    if (!username || !email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      // Llama a la API
      const response = await registerUser({ username, email, password }); // Asume que devuelve { success: boolean, message?: string }

      if (response.success) {
        // Éxito en el registro
        Alert.alert(
          'Éxito',
          response.message || '¡Registro exitoso!',
          [
            {
              text: 'Ir a Inicio de Sesión',
              // 3. CAMBIA navigation.navigate a router.push/replace
              onPress: () => router.replace('/login') // Usa replace para no añadir Register al historial
            }
          ]
        );
      } else {
         // Caso donde el API devuelve { success: false, message: '...' }
         // (Asegúrate que tu API devuelva esto o lanza un error específico)
         Alert.alert('Error de Registro', response.message || 'No se pudo completar el registro.');
      }

    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorResponse = error.response;
      let errorMessage = 'Ocurrió un error inesperado durante el registro.';

      if (errorResponse) {
        if (errorResponse.status === 409) { // Conflicto (ej: email ya existe)
          errorMessage = errorResponse.data?.message || 'El correo electrónico o nombre de usuario ya están en uso.';
        } else if (errorResponse.data?.message) {
          errorMessage = errorResponse.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      Alert.alert('Error de Registro', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Image
          source={require('../assets/images/login.png')} // <-- VERIFICA RUTA
          style={styles.logo}
          resizeMode="contain"
        />
      <AuthForm
        fields={[
          { label: 'Nombre de usuario', value: username, onChangeText: setUsername, autoCapitalize: 'none' }, // autoCapitalize none para username suele ser mejor
          { label: 'Email', value: email, onChangeText: setEmail, keyboardType: 'email-address', autoCapitalize: 'none' },
          { label: 'Contraseña', value: password, onChangeText: setPassword, secure: true, autoCapitalize: 'none' }
        ]}
      />
      <CustomButton
        title="GUARDAR REGISTRO" // Más específico
        iconColor='#1a1919'
        iconName='save-outline'
        iconPosition='right'
        iconSize={24}
        onPress={handleRegister}
        style={styles.button}/>
      <CustomButton
        title="YA TENGO CUENTA (LOGIN)" // Más claro
        iconColor='#1a1919'
        iconName='log-in-outline'
        iconPosition='right'
        iconSize={24}
        // 4. CAMBIA navigation.navigate a router.push (o goBack si prefieres)
        onPress={() => router.push('/login')} // push añade login al historial
        // Alternativa: si quieres que actúe como el botón 'atrás':
        // onPress={() => router.back()}
        style={styles.button}
      />
    </View>
  );
};

// ... (estilos igual)
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
    marginTop: -50, // Ajusta
    marginBottom: 30, // Espacio
  },
  button: {
    width: '80%',
    backgroundColor: '#F8D930',
    marginTop: 15, // Espaciado entre botones y form
  },
});


export default RegisterScreen;