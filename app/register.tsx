import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image  } from 'react-native';
import AuthForm from '../src/components/AuthForm';
import CustomButton from '../src/components/CustomButton';
import { registerUser } from '../src/services/api';
import { NavigationProp } from '@react-navigation/native';

const RegisterScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    try {
      if (!username || !email || !password) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }

      // Validación de formato de email
      if (!validateEmail(email)) {
        Alert.alert('Error', 'Por favor ingresa un email válido');
        return;
      }

      // Validación de contraseña (ejemplo mínimo 6 caracteres)
      if (password.length < 6) {
        Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
        return;
      }

      const response = await registerUser({
        username,
        email,
        password
      });

      if (response.success) {
        Alert.alert('Éxito', response.message || 'Registro exitoso', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      const errorResponse = (error as any).response;
      const errorMessage = errorResponse?.data?.message || 'Error en el registro';

      // Manejo específico para correo existente
      if (errorResponse?.status === 409) {
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image 
          source={require('../assets/images/login.png')} // Asegúrate de tener esta imagen
          style={styles.logo}
          resizeMode="contain"
        />
      <AuthForm
        fields={[
          { label: 'Nombre de usuario', value: username, onChangeText: setUsername, autoCapitalize: 'words' },
          { label: 'Email', value: email, onChangeText: setEmail,  keyboardType: 'email-address'},
          { label: 'Contraseña', value: password, onChangeText: setPassword, secure: true, autoCapitalize: 'none' }
        ]}
      />
      <CustomButton 
        title="GUARDAR" 
        iconColor='#1a1919'
        iconName='save-outline'
        iconPosition='right'
        iconSize={24}
        onPress={handleRegister} 
        style={styles.button}/>
      <CustomButton
        title="TENGO UNA CUENTA"
        iconColor='#1a1919'
        iconName='person-outline'  
        iconPosition='right'
        iconSize={24}
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
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
    marginTop: -50,
  },
  button: {
    width: '80%',
    backgroundColor: '#F8D930',
  },
});

export default RegisterScreen;