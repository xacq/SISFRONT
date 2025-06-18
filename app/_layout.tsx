// Sport/app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutNav />
    </AuthProvider>
  );
}

function LayoutNav() {
  const { userToken, userInfo, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // Rutas públicas: coinciden con los nombres de archivo en `app/`
    // Por ejemplo, `app/login.tsx` -> `login`
    const publicRoutes = ['login', 'register', '_sitemap', '+not-found'];

    const currentTopLevelSegment = segments[0] || null;

    // CASO A: Usuario NO logueado
    if (!userToken) {
      // Y NO estamos ya en una ruta pública
      if (currentTopLevelSegment && !publicRoutes.includes(currentTopLevelSegment)) {
        router.replace('/login');
      }
    }
    // CASO B: Usuario SÍ logueado
    else {
      // Y SÍ estamos en una ruta pública (o en la raíz, currentTopLevelSegment es null)
      if (!currentTopLevelSegment || publicRoutes.includes(currentTopLevelSegment)) {
        router.replace('/(tabs)');
      }
    }

  }, [isLoading, userToken, segments, router, userInfo]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F8D930" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" options={{ presentation: 'modal' }} />
      <Stack.Screen name="register" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a19',
  },
});