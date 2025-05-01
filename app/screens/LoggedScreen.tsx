import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { RootStackParamList } from '../types/NavigationTypes';


const LoggedScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
        <Image 
        source={require('../../assets/images/login.png')} // Usa el ícono del sistema
        style={styles.logo}
        resizeMode="contain"
      />
      <CustomButton 
        title="Datos Personales" 
        iconName='list' // Icono de guardar
        iconPosition="right"
        iconColor="#1a1919"
        iconSize={24}
        onPress={() => navigation.navigate('PersonalDataForm')} 
        style={styles.button}></CustomButton>

      <CustomButton 
        title="Productos SIS" 
        onPress={() => navigation.navigate('ProductListScreen')}
        style={styles.button}
      />  

      <CustomButton 
        title="Cerrar Sesión"
        iconName="exit" // Icono de guardar
        iconPosition="right"
        iconColor="#1a1919"
        iconSize={24}
        onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: 'Login' as never }],
        })} 
        style={styles.logoutButton}></CustomButton>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1919',
    padding: 20,
  },
  logo: {
    height: 110,
    marginTop: -100,
  },
  button: {
    backgroundColor: '#F8D930',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#F8D930',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoggedScreen;