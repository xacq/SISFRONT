// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome'; // O tu librería de iconos

// Función helper para el icono (opcional pero limpio)
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F8D930', // Tu color activo
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#1a1a19' }, // Color de fondo de la barra
        headerShown: true, // Decide si quieres cabecera por defecto en tabs
      }}>
      {/* Define CADA PANTALLA que debe aparecer como una pestaña */}
      {/* Asegúrate que 'name' coincida con el nombre del ARCHIVO dentro de app/(tabs)/ */}

      <Tabs.Screen
        name="index" // Asume que tienes un archivo app/(tabs)/index.tsx (Quizás tu HomeScreen?)
        options={{
          title: 'Inicio', // Título de la pestaña y cabecera
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          // headerRight: () => (...) // Puedes añadir botones a la cabecera aquí
        }}
      />
      <Tabs.Screen
        name="products" // DEBERÍAS RENOMBRAR ProductListScreen.tsx a products.tsx
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />
       <Tabs.Screen
        name="profile" // DEBERÍAS RENOMBRAR PersonalDataForm.tsx a profile.tsx (o algo similar)
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      {/* Añade más Tabs.Screen para otras pestañas si las tienes */}
    </Tabs>
  );
}