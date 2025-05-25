import React, { useState, useContext } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../src/components/CustomButton'; // Verifica ruta
import { saveUserProfile } from '../../src/services/api'; // Verifica ruta
// import AuthContext from '../../src/context/AuthContext'; // Quitado si no se usa aquí
import { useAuth } from '../../src/context/AuthContext'; // Usar el hook es mejor
import { useRouter } from 'expo-router'; // Para navegación


// Tipos (sin cambios)
type Gender = 'hombre' | 'mujer' | 'otro' | 'prefiero no decir';
type ActivityLevel = 'sedentario' | 'moderado' | 'activo' | 'muy activo';
type TrainingFrequency = '1-2' | '3-4' | '5+' | 'ocacional';
type PrimaryGoal = 'mejor rendimiento' | 'perder peso' | 'ganar musculo' | 'resistencia' | 'recuperacion' | 'por salud';
type SweatLevel = 'bajo' | 'medio' | 'alto';
type CaffeineTolerance = 'no' | 'bajo' | 'medio' | 'alto';
type DietaryRestriction = 'vegetariano' | 'vegano' | 'libre de gluten' | 'libre de lactosa' | 'libre de frutos secos' | 'no';

// 1. Cambia dietary_restrictions a string simple
interface UserProfileData {
  age: number | string; // Permitir string temporalmente por el input
  weight: number | string; // Permitir string temporalmente
  height: number | string; // Permitir string temporalmente
  gender: Gender;
  activity_level: ActivityLevel;
  training_frequency: TrainingFrequency;
  primary_goal: PrimaryGoal;
  sweat_level: SweatLevel;
  caffeine_tolerance: CaffeineTolerance;
  dietary_restrictions: DietaryRestriction; // <-- AHORA ES UNA SOLA STRING
}

const PersonalDataForm = () => {
  const router = useRouter();
  const { user } = useAuth(); // Usa el hook
  // 2. Estado inicial con dietary_restrictions como 'no' (string)
  const [userData, setUserData] = useState<UserProfileData>({
    age: '', // Inicializar como string para el input
    weight: '',
    height: '',
    gender: 'hombre',
    activity_level: 'moderado',
    training_frequency: '3-4',
    primary_goal: 'mejor rendimiento',
    sweat_level: 'medio',
    caffeine_tolerance: 'medio',
    dietary_restrictions: 'no' // <-- VALOR INICIAL STRING
  });

  // --- REEMPLAZA tu función handleSubmit actual con ESTA ---
  const handleSubmit = async () => {
    // Validación y conversión de numéricos (ESTO ESTABA BIEN)
    const ageNum = parseInt(String(userData.age), 10);
    const weightNum = parseFloat(String(userData.weight));
    const heightNum = parseFloat(String(userData.height));

    if (isNaN(ageNum) || ageNum <= 0 || isNaN(weightNum) || weightNum <= 0 || isNaN(heightNum) || heightNum <= 0) {
        Alert.alert('Error', 'Edad, peso y altura deben ser números válidos y positivos.');
        return;
    }

    const profileDataToSend = {
        ...userData,
        age: ageNum,
        weight: weightNum,
        height: heightNum,
    };

    console.log('[PROFILE.TSX] handleSubmit triggered.');
    console.log('[PROFILE.TSX] Current user object from context:', JSON.stringify(user, null, 2));

    // --- ¡¡CAMBIO CRUCIAL AQUÍ!! ---
    // Extrae el ID del objeto anidado user.user
    // Usa optional chaining (?.) por si acaso user o user.user fueran nulos/undefined
    const userId = user?.id;

    // Log del ID EXTRAÍDO
    console.log('[PROFILE.TSX] Extracted userId to be passed:', userId, '(Type:', typeof userId, ')');
    // --- FIN CAMBIO CRUCIAL ---

    try {
      // --- ¡¡CAMBIO CRUCIAL EN LA VALIDACIÓN!! ---
      // Valida la variable 'userId' que acabamos de extraer
      if (!userId || typeof userId !== 'number') { // Verifica si existe Y si es un número
        // Este es el error que estabas viendo "Usuario inválido..."
        Alert.alert('Error', 'ID de usuario inválido o no encontrado en el contexto. Intenta iniciar sesión de nuevo.');
        return; // Detiene si el ID no es válido
      }
      // --- FIN CAMBIO VALIDACIÓN ---

      // --- ¡¡CAMBIO CRUCIAL EN LA LLAMADA A API!! ---
      // Llama a saveUserProfile con la variable 'userId' validada
      await saveUserProfile(userId, profileDataToSend);
      // --- FIN CAMBIO LLAMADA ---

      Alert.alert('Éxito', 'Perfil guardado correctamente', [
         { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
        console.error('Error saving profile:', error);
        const errorMsg = error?.response?.data?.message || error?.message || 'No se pudo guardar el perfil.';
        Alert.alert('Error', errorMsg);
    }
  };



  // Función para manejar cambio en TextInput numéricos
   const handleNumericChange = (field: keyof UserProfileData, text: string) => {
    // Permite solo números y un punto decimal (ajusta según necesites)
    const numericValue = text.replace(/[^0-9.]/g, '');
    setUserData({ ...userData, [field]: numericValue });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
       {/* Usar onChangeText para todos los inputs */}
      <Text style={styles.label}>Edad:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ej: 25"
        value={String(userData.age)} // Convertir a string para el input
        onChangeText={(text) => handleNumericChange('age', text)}
      />

      <Text style={styles.label}>Peso (kg):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric" // numeric permite punto en iOS, decimal-pad en Android
        placeholder="Ej: 70.5"
        value={String(userData.weight)} // Convertir a string para el input
        onChangeText={(text) => handleNumericChange('weight', text)}
      />

      <Text style={styles.label}>Altura (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ej: 175"
        value={String(userData.height)} // Convertir a string para el input
        onChangeText={(text) => handleNumericChange('height', text)}
      />

      {/* Los pickers para campos ENUM están bien */}
      <Text style={styles.label}>Género:</Text>
      <Picker
        selectedValue={userData.gender}
        onValueChange={(value) => setUserData({ ...userData, gender: value })}
        style={styles.picker}
        itemStyle={styles.pickerItem} // Para estilo de items si es necesario
      >
        <Picker.Item label="Hombre" value="hombre" />
        <Picker.Item label="Mujer" value="mujer" />
        <Picker.Item label="Otro" value="otro" />
        <Picker.Item label="Prefiero no decir" value="prefiero no decir" />
      </Picker>

       {/* ... otros Pickers iguales (activity_level, etc.) ... */}

      <Text style={styles.label}>Nivel de actividad:</Text>
      <Picker /* ... (igual) ... */ selectedValue={userData.activity_level} onValueChange={(value) => setUserData({ ...userData, activity_level: value })} style={styles.picker} itemStyle={styles.pickerItem} >
            <Picker.Item label="Sedentario" value="sedentario" />
            <Picker.Item label="Moderado" value="moderado" />
            <Picker.Item label="Activo" value="activo" />
            <Picker.Item label="Muy activo" value="muy activo" />
       </Picker>
        <Text style={styles.label}>Frecuencia de entrenamiento:</Text>
        <Picker selectedValue={userData.training_frequency} onValueChange={(value) => setUserData({ ...userData, training_frequency: value })} style={styles.picker} itemStyle={styles.pickerItem}>
             <Picker.Item label="1-2 veces por semana" value="1-2" />
             <Picker.Item label="3-4 veces por semana" value="3-4" />
             <Picker.Item label="5+ veces por semana" value="5+" />
             <Picker.Item label="Ocasional" value="ocacional" />
           </Picker>

       <Text style={styles.label}>Objetivo principal:</Text>
        <Picker selectedValue={userData.primary_goal} onValueChange={(value) => setUserData({ ...userData, primary_goal: value })} style={styles.picker} itemStyle={styles.pickerItem}>
           <Picker.Item label="Mejor rendimiento" value="mejor rendimiento" />
             <Picker.Item label="Perder peso" value="perder peso" />
            <Picker.Item label="Ganar músculo" value="ganar musculo" />
            <Picker.Item label="Resistencia" value="resistencia" />
             <Picker.Item label="Recuperación" value="recuperacion" />
             <Picker.Item label="Por salud" value="por salud" />
          </Picker>

       <Text style={styles.label}>Nivel de sudoración:</Text>
       <Picker selectedValue={userData.sweat_level} onValueChange={(value) => setUserData({ ...userData, sweat_level: value })} style={styles.picker} itemStyle={styles.pickerItem}>
           <Picker.Item label="Bajo" value="bajo" />
            <Picker.Item label="Medio" value="medio" />
           <Picker.Item label="Alto" value="alto" />
          </Picker>

        <Text style={styles.label}>Tolerancia a la cafeína:</Text>
        <Picker selectedValue={userData.caffeine_tolerance} onValueChange={(value) => setUserData({ ...userData, caffeine_tolerance: value })} style={styles.picker} itemStyle={styles.pickerItem}>
            <Picker.Item label="No consumo" value="no" />
            <Picker.Item label="Baja" value="bajo" />
           <Picker.Item label="Media" value="medio" />
            <Picker.Item label="Alta" value="alto" />
           </Picker>


      {/* 5. Reemplaza la sección de checkboxes con UN SOLO Picker */}
      <Text style={styles.label}>Restricción dietética principal:</Text>
      <Picker
        selectedValue={userData.dietary_restrictions}
        onValueChange={(value) => setUserData({ ...userData, dietary_restrictions: value })}
        style={styles.picker} // Usa el estilo de picker normal
        itemStyle={styles.pickerItem}
      >
        {/* Define cada opción como Picker.Item */}
        <Picker.Item label="Ninguna" value="no" />
        <Picker.Item label="Vegetariano" value="vegetariano" />
        <Picker.Item label="Vegano" value="vegano" />
        <Picker.Item label="Libre de gluten" value="libre de gluten" />
        <Picker.Item label="Libre de lactosa" value="libre de lactosa" />
        <Picker.Item label="Libre de frutos secos" value="libre de frutos secos" />
      </Picker>
      {/* FIN del cambio para selección única */}


      <CustomButton
        title="GUARDAR PERFIL" // Más específico
        onPress={handleSubmit}
        iconName="save-outline" // Icono ionicons
        iconPosition="right"
        iconColor="#1a1919"
        iconSize={24}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20, // Más padding general
    paddingBottom: 40, // Espacio extra al final para el botón
    backgroundColor: '#1a1919',
  },
  label: {
    fontSize: 16,
    marginBottom: 5, // Menos espacio debajo del label
    color: '#F8D930',
    fontWeight: '500', // Un poco más de peso
  },
  input: {
    borderWidth: 1,
    borderColor: '#555', // Borde menos llamativo
    borderRadius: 8, // Más redondeado
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20, // Más espacio entre inputs
    color: '#FFFFFF', // Texto blanco
    backgroundColor: '#2a2a2a', // Fondo de input oscuro
    fontSize: 16,
  },
  picker: {
    // Estilos base para todos los pickers
    // NOTA: El estilo visual REAL de Picker varía MUCHO entre iOS y Android
    // y a menudo no toma todos los estilos CSS.
    backgroundColor: '#2a2a2a',
    color: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,

  },
  pickerItem: {
      // Estilos para los ITEMS dentro del Picker (puede no funcionar en todas las plataformas)
     // color: '#FFFFFF', // Intenta forzar color de item
     // backgroundColor: '#2a2a2a', // Intenta forzar fondo de item
  },
  // Ya no se necesitan smallPicker, checkboxContainer, checkboxRow, checkboxLabel
  button: {
    backgroundColor: '#F8D930',
    marginTop: 30, // Más espacio antes del botón
    paddingVertical: 15, // Botón más alto
  },
});


export default PersonalDataForm;