import { View, Text, Image, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import { NavigationProp } from '@react-navigation/native';

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/splash-icon.png')} // Asegúrate de tener esta imagen
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}></Text>
      
      <CustomButton
        title="ACCEDE AL SISTEMA"
        iconColor='#1a1919'
        iconName='enter-outline'
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
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,

  },
  button: {
    width: '80%',
    backgroundColor: '#F8D930',
  },
});

export default HomeScreen;