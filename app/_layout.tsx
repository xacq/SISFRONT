// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router'; // Eliminé Redirect ya que no se usa aquí directamente
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native'; // Importa para indicador de carga

export default function RootLayout() {
  // Envuelve toda la navegación con el AuthProvider
  return (
    <AuthProvider>
      <LayoutNav />
    </AuthProvider>
  );
}

function LayoutNav() {
  // Obtiene el estado de autenticación y la información de si aún está cargando
  // (Asume que useAuth puede devolver un estado isLoadingAuth)
  const { user, isLoadingAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('LayoutNav Effect - isLoadingAuth:', isLoadingAuth, 'User:', user, 'Segments:', segments);

    // --- No hacer nada si todavía estamos determinando el estado de autenticación ---
    if (isLoadingAuth) {
      console.log('Auth state still loading, skipping redirect logic.');
      return; // Salir temprano si la autenticación aún no está lista
    }

    // --- Definir rutas públicas donde un usuario NO logueado PUEDE estar ---
    //    Asegúrate que los nombres coincidan con los archivos en app/ (ej: 'login', 'register')
    const publicRoutes = ['login', 'register', '_sitemap', '+not-found']; // Añade otras rutas públicas si existen

    // Obtiene el segmento de ruta actual (o null si estamos en la raíz)
    const currentSegment = segments[0] || null;

    // --- Lógica de redirección ---

    // CASO 1: Usuario NO logueado
    if (!user) {
      // Si NO estamos en una ruta pública permitida...
      if (currentSegment && !publicRoutes.includes(currentSegment)) {
        console.log(`Redirecting to /login (User NOT logged in, current segment: ${currentSegment})`);
        router.replace('/login');
      } else {
        // Ya estamos en una ruta pública (login, register) o en la raíz inicial antes del primer render.
        // No hacemos nada, permitimos que el usuario se quede.
        console.log(`User NOT logged in, staying on public route: ${currentSegment}`);
      }
    }
    // CASO 2: Usuario SÍ logueado
    else {
      // Si estamos en la raíz, en login, register, o cualquier otra ruta "pública"
      // (o un grupo auth si lo tuvieras)...
      if (!currentSegment || publicRoutes.includes(currentSegment) /* || currentSegment === '(auth)' */) {
        console.log(`Redirecting to /(tabs)/ (User logged in, current segment: ${currentSegment})`);
        router.replace('/(tabs)/'); // Redirigir a la pantalla principal de las tabs
      } else {
        // Ya estamos dentro de la app (ej: en /tabs/products).
        // No hacemos nada, permitimos que el usuario navegue libremente.
         console.log(`User logged in, staying in app route: ${segments.join('/')}`);
      }
    }

  // Dependencias del useEffect: estado de carga, usuario y segmentos de ruta
  }, [isLoadingAuth, user, segments, router]);

  // --- Renderizado condicional mientras carga el estado de Auth ---
  if (isLoadingAuth) {
    // Muestra un indicador de carga básico para evitar mostrar pantallas incorrectas brevemente
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // --- Renderizar el Stack Navigator principal ---
  // Una vez que sabemos el estado de Auth (cargado) y las redirecciones se han ejecutado (o no),
  // renderizamos el Stack definido. Expo Router mostrará la pantalla correcta según la URL actual.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Define las pantallas de nivel superior que el Stack puede manejar */}
      {/* El grupo (tabs) representa toda la navegación por pestañas */}
      <Stack.Screen name="(tabs)" />
      {/* Pantalla de login, accesible directamente */}
      <Stack.Screen name="login" options={{ presentation: 'modal' }} />
       {/* Pantalla de registro, necesita existir como app/register.tsx */}
      <Stack.Screen name="register" options={{ presentation: 'modal' }} />
      {/* Pantalla por defecto para rutas no encontradas */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}