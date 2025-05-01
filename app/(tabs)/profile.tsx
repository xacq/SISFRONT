import React, { useState , useContext} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp } from '@react-navigation/native';
import CustomButton from '../../src/components/CustomButton';
import { saveUserProfile } from '../../src/services/api';
import AuthContext from '../../src/context/AuthContext';

type Gender = 'hombre' | 'mujer' | 'otro' | 'prefiero no decir';
type ActivityLevel = 'sedentario' | 'moderado' | 'activo' | 'muy activo';
type TrainingFrequency = '1-2' | '3-4' | '5+' | 'ocacional';
type PrimaryGoal = 'mejor rendimiento' | 'perder peso' | 'ganar musculo' | 'resistencia' | 'recuperacion' | 'por salud';
type SweatLevel = 'bajo' | 'medio' | 'alto';
type CaffeineTolerance = 'no' | 'bajo' | 'medio' | 'alto';
type DietaryRestriction = 'vegetariano' | 'vegano' | 'libre de gluten' | 'libre de lactosa' | 'libre de frutos secos' | 'no';

interface UserProfileData {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activity_level: ActivityLevel;
  training_frequency: TrainingFrequency;
  primary_goal: PrimaryGoal;
  sweat_level: SweatLevel;
  caffeine_tolerance: CaffeineTolerance;
  dietary_restrictions: DietaryRestriction[];
}

const PersonalDataForm = ({ navigation }: { navigation: NavigationProp<any> }) => {
const authContext = useContext(AuthContext);

if (!authContext) {
  throw new Error('AuthContext must be used within an AuthProvider');
}

const { user } = authContext;
const [userData, setUserData] = useState<UserProfileData>({
    age: 0,
    weight: 0,
    height: 0,
    gender: 'hombre',
    activity_level: 'moderado',
    training_frequency: '3-4',
    primary_goal: 'mejor rendimiento',
    sweat_level: 'medio',
    caffeine_tolerance: 'medio',
    dietary_restrictions: ['no']
  });

  const handleDietaryChange = (value: DietaryRestriction) => {
    if (value === 'no') {
      setUserData({ ...userData, dietary_restrictions: ['no'] });
    } else {
      const updated = userData.dietary_restrictions.includes(value)
        ? userData.dietary_restrictions.filter(item => item !== value && item !== 'no')
        : [...userData.dietary_restrictions.filter(item => item !== 'no'), value];
      setUserData({ ...userData, dietary_restrictions: updated.length ? updated : ['no'] });
    }
  };

  const handleSubmit = async () => {
    if (!userData.age || !userData.weight || !userData.height) {
      Alert.alert('Error', 'Edad, peso y altura son campos obligatorios');
      return;
    }
    if (userData.dietary_restrictions.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos una restricción dietética o "Ninguna"');
      return;
    }
    try {
      if (!user) {
        Alert.alert('Error', 'Usuario no encontrado. Por favor, inicia sesión nuevamente.');
        return;
      }
      await saveUserProfile(user.id, userData);
      Alert.alert('Éxito', 'Perfil guardado correctamente');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'No se pudo guardar el perfil. Inténtalo de nuevo.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.label}>Edad:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ej: 25"
        onChangeText={(text) => setUserData({ ...userData, age: parseInt(text) || 0 })}
      />

      <Text style={styles.label}>Peso (kg):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ej: 70.5"
        onChangeText={(text) => setUserData({ ...userData, weight: parseFloat(text) || 0 })}
      />

      <Text style={styles.label}>Altura (cm):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ej: 175"
        onChangeText={(text) => setUserData({ ...userData, height: parseFloat(text) || 0 })}
      />

      <Text style={styles.label}>Género:</Text>
      <Picker
        selectedValue={userData.gender}
        onValueChange={(value) => setUserData({ ...userData, gender: value })}
        style={styles.picker}
      >
        <Picker.Item label="Hombre" value="hombre" />
        <Picker.Item label="Mujer" value="mujer" />
        <Picker.Item label="Otro" value="otro" />
        <Picker.Item label="Prefiero no decir" value="prefiero no decir" />
      </Picker>

      <Text style={styles.label}>Nivel de actividad:</Text>
      <Picker
        selectedValue={userData.activity_level}
        onValueChange={(value) => setUserData({ ...userData, activity_level: value })}
        style={styles.picker}
      >
        <Picker.Item label="Sedentario" value="sedentario" />
        <Picker.Item label="Moderado" value="moderado" />
        <Picker.Item label="Activo" value="activo" />
        <Picker.Item label="Muy activo" value="muy activo" />
      </Picker>

      <Text style={styles.label}>Frecuencia de entrenamiento:</Text>
      <Picker
        selectedValue={userData.training_frequency}
        onValueChange={(value) => setUserData({ ...userData, training_frequency: value })}
        style={styles.picker}
      >
        <Picker.Item label="1-2 veces por semana" value="1-2" />
        <Picker.Item label="3-4 veces por semana" value="3-4" />
        <Picker.Item label="5+ veces por semana" value="5+" />
        <Picker.Item label="Ocasional" value="ocacional" />
      </Picker>

      <Text style={styles.label}>Objetivo principal:</Text>
      <Picker
        selectedValue={userData.primary_goal}
        onValueChange={(value) => setUserData({ ...userData, primary_goal: value })}
        style={styles.picker}
      >
        <Picker.Item label="Mejor rendimiento" value="mejor rendimiento" />
        <Picker.Item label="Perder peso" value="perder peso" />
        <Picker.Item label="Ganar músculo" value="ganar musculo" />
        <Picker.Item label="Resistencia" value="resistencia" />
        <Picker.Item label="Recuperación" value="recuperacion" />
        <Picker.Item label="Por salud" value="por salud" />
      </Picker>

      <Text style={styles.label}>Nivel de sudoración:</Text>
      <Picker
        selectedValue={userData.sweat_level}
        onValueChange={(value) => setUserData({ ...userData, sweat_level: value })}
        style={styles.picker}
      >
        <Picker.Item label="Bajo" value="bajo" />
        <Picker.Item label="Medio" value="medio" />
        <Picker.Item label="Alto" value="alto" />
      </Picker>

      <Text style={styles.label}>Tolerancia a la cafeína:</Text>
      <Picker
        selectedValue={userData.caffeine_tolerance}
        onValueChange={(value) => setUserData({ ...userData, caffeine_tolerance: value })}
        style={styles.picker}
      >
        <Picker.Item label="No consumo" value="no" />
        <Picker.Item label="Baja" value="bajo" />
        <Picker.Item label="Media" value="medio" />
        <Picker.Item label="Alta" value="alto" />
      </Picker>

      <Text style={styles.label}>Restricciones dietéticas:</Text>
      <View style={styles.checkboxContainer}>
        {[
          { label: 'Vegetariano', value: 'vegetariano' },
          { label: 'Vegano', value: 'vegano' },
          { label: 'Libre de gluten', value: 'libre de gluten' },
          { label: 'Libre de lactosa', value: 'libre de lactosa' },
          { label: 'Libre de frutos secos', value: 'libre de frutos secos' },
          { label: 'Ninguna', value: 'no' }
        ].map((item) => (
          <View key={item.value} style={styles.checkboxRow}>
            <Text style={styles.checkboxLabel}>{item.label}</Text>
            <Picker
              selectedValue={userData.dietary_restrictions.includes(item.value as DietaryRestriction)}
              onValueChange={() => handleDietaryChange(item.value as DietaryRestriction)}
              style={styles.smallPicker}
            >
              <Picker.Item label="No" value={false} />
              <Picker.Item label="Sí" value={true} />
            </Picker>
          </View>
        ))}
      </View>

      <CustomButton 
        title="GUARDAR" 
        onPress={handleSubmit}
        iconName="save"
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
    padding: 10,
    backgroundColor: '#1a1919',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    color: '#F8D930',
  },
  input: {
    borderWidth: 1,
    borderColor: '#F8D930',
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    color:'black',
    backgroundColor: 'lightgray'
  },
  picker: {
    borderWidth: 0,
    borderColor: '#F8D930',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'lightgray'
  },
  smallPicker: {
    borderWidth: 0,
    borderColor: '#F8D930',
    borderRadius: 5,
    width: 100,
    backgroundColor: 'lightgray'
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  checkboxLabel: {
    color: '#F8D930',
    flex: 1,
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#F8D930',
    width: '100%',
  },
});

export default PersonalDataForm;