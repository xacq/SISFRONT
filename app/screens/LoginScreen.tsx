import React, { useState } from 'react';
import { View, Image, Alert, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';
import CustomButton from '../components/CustomButton';
import { loginUser } from '../services/api';
import { NavigationProp } from '@react-navigation/native';

const LoginScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Validar que los campos no estén vacíos
      if (!email || !password) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

      // Llamar al backend para autenticar al usuario
      const response = await loginUser(email, password);

      // Verificar si la respuesta indica éxito
      if (response.success) {
        navigation.navigate('Logged');
      } else {
        Alert.alert('Error', response.message || 'Credenciales inválidas');
      }
    } catch (error) {
      const errorResponse = (error as any).response;
      const errorMessage = errorResponse?.data?.message || 'Error en el inicio de sesión';

      // Manejo específico para credenciales inválidas
      if (errorResponse?.status === 401) {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/login.png')} // Asegúrate de tener esta imagen
        style={styles.logo}
        resizeMode="contain"
      />
      <AuthForm
        fields={[
          { label: 'Correo Electrónico', value: email, onChangeText: setEmail },
          { label: 'Contraseña', value: password, onChangeText: setPassword, secure: true }
        ]}
      />
      <CustomButton 
        title="INGRESAR" 
        iconColor='#1a1919'
        iconName='person-outline'
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
        onPress={() => navigation.navigate('Register')}
        style={styles.buttonregister}
      />
    </View>
  );
};

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
    marginTop: -100,
  },
  button: {
    width: '80%',
    backgroundColor: '#F8D930',
  },
  buttonregister: {
    width: '80%',
    backgroundColor: '#F8D930',
  },
  
});

export default LoginScreen;