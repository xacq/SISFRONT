// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments, Redirect } from 'expo-router'; // <-- Añade Redirect
import { AuthProvider, useAuth } from '../src/context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutNav />
    </AuthProvider>
  );
}

function LayoutNav() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isTryingToRedirect, setIsTryingToRedirect] = React.useState(true); // Para evitar flicker

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'; // O como definas tu grupo auth
    const inAppGroup = segments[0] === '(tabs)';

    console.log('LayoutNav Effect - User:', user, 'Segments:', segments);

    // Si no hay usuario Y NO estamos explícitamente en login/register (o grupo auth)
    if (!user && !inAuthGroup && segments[0] !== 'login' && segments[0] !== '_sitemap') {
         console.log('Redirecting to /login');
         router.replace('/login');
    }
    // Si HAY usuario Y estamos en una ruta inicial/auth
    else if (user && (segments.length === 0 || inAuthGroup || segments[0] === 'login')) {
         console.log('Redirecting to /(tabs)/');
         router.replace('/(tabs)/');
    }
    // Si ninguna de las condiciones de redirección se cumple (ya estamos donde debemos estar),
    // indicamos que ya no estamos intentando redirigir activamente.
    setIsTryingToRedirect(false);

  }, [user, segments, router]);

  // Si no hay segmentos definidos aún, o si todavía estamos en el proceso inicial
  // de decidir a dónde redirigir basado en el auth, podemos renderizar un Null
  // o un indicador de carga, o dejar que Stack intente renderizar.
  // Sin embargo, añadir un Redirect explícito como ruta por defecto puede ser más claro.


  // ¡OJO! La lógica del useEffect ya debería manejar las redirecciones.
  // Renderizar directamente el Stack es lo normal.
  // Si las redirecciones fallan o son lentas, esta podría ser la causa de errores
  // al buscar rutas iniciales inexistentes.

  return (
    <Stack screenOptions={{ headerShown: false }}>
        {/* La definición del Stack debería ser suficiente si el useEffect funciona bien */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />

        {/* Si necesitas forzar un inicio POR DEFECTO si nada más coincide,
           puedes añadir un Redirect, PERO puede causar bucles si no tienes cuidado.
           Normalmente, el Stack simplemente no encuentra ruta y muestra +not-found
           o el useEffect debería redirigir. */}
         {/* <Stack.Screen name="index" redirect={true} href="/login" /> // ¡USAR CON CUIDADO! */}
      </Stack>
  );
}