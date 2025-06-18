// Sport/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Asegúrate que la ruta a tu api.ts sea correcta

// Interfaz para la información del usuario que quieres en el contexto
export interface User {
  id: number; // o string, dependiendo de tu backend
  username: string;
  email: string;
  // puedes añadir más campos si los devuelves en el login y los quieres disponibles globalmente
}

interface AuthContextType {
  userToken: string | null;
  userInfo: User | null; // Cambiado de User a UserInfo para más claridad
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>; // Modificado para recibir token y userData
  logout: () => Promise<void>;
  // No necesitamos una función `user` separada, `userInfo` la reemplaza.
}

// No es necesario exportar 'AuthContext' directamente si usamos el hook 'useAuth'
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Para manejar la carga inicial del token/usuario

  const login = async (token: string, userData: User) => {
    setIsLoading(true);
    setUserToken(token);
    setUserInfo(userData);
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
    // Actualizar el header por defecto de Axios
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    // Eliminar el header de Axios
    delete api.defaults.headers.common['Authorization'];
    setIsLoading(false);
  };

  // Función para verificar si hay un token/usuario guardado al iniciar la app
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const storedUserInfo = await AsyncStorage.getItem('userInfo');

      if (token && storedUserInfo) {
        setUserToken(token);
        setUserInfo(JSON.parse(storedUserInfo));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error al cargar datos de sesión:", e);
      // Opcional: Podrías intentar limpiar el storage si está corrupto
      // await AsyncStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, userInfo, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext; // Exporta el contexto para que pueda ser usado en otros componentes
// No es necesario el export default de AuthContext si ya tenemos useAuth