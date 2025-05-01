import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import LoggedScreen from '../screens/LoggedScreen';
import PersonalDataForm from '../screens/PersonalDataForm';
import ProductListScreen from '../screens/ProductListScreen'; 
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1919',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} 
        options={{ title: 'Inicio del Sistema' }}
      />
      <Stack.Screen name="Register" component={RegisterScreen}         
        options={{ title: 'Registro de usuario' }}
      />
      <Stack.Screen name="Logged" component={LoggedScreen} 
        options={{ title: 'Panel Principal' }}
      />
      <Stack.Screen name="PersonalDataForm" component={PersonalDataForm}
        options={{ title: 'Estado Actual' }}
      />
      <Stack.Screen name="ProductListScreen" component={ProductListScreen}
        options={{ title: 'Productos SIS' }}
      />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen}
        options={{ title: 'Detalle del Producto' }}
      />
      <Stack.Screen name="Home" component={HomeScreen} 
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}